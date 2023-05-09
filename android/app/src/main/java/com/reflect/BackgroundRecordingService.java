package com.reflect;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import com.facebook.react.bridge.ReactContext;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reflect.R; // Replace "yourpackagename" with your actual package name
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import java.io.IOException;
import java.io.IOException;

public class BackgroundRecordingService extends HeadlessJsTaskService {
    private static final int NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "BackgroundRecordingChannel";
    private static final String CHANNEL_NAME = "Background Recording";

    private MediaRecorder mediaRecorder;
    private boolean isRecording = false;

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannel(NotificationManager notificationManager) {
        NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_LOW);
        channel.setSound(null, null);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        notificationManager.createNotificationChannel(channel);
    }

    private void startRecording() {
        mediaRecorder = new MediaRecorder();
        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        mediaRecorder.setOutputFile(getOutputFilePath());

        try {
            mediaRecorder.prepare();
            mediaRecorder.start();
            isRecording = true;
            sendRecordingEvent(true);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void stopRecording() {
        if (isRecording) {
            mediaRecorder.stop();
            mediaRecorder.release();
            mediaRecorder = null;
            isRecording = false;
            sendRecordingEvent(false);
        }
    }

    private String getOutputFilePath() {
        // Set the path where you want to store the recorded audio file
        // You can change the directory as per your requirements
        return getApplicationContext().getExternalFilesDir(null).getAbsolutePath() + "/recording.3gp";
    }

       private void sendRecordingEvent(boolean isRecording) {
    ReactContext context = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
    if (context != null) {
        Intent intent = new Intent("BackgroundRecordingEvent");
        intent.putExtra("isRecording", isRecording);
        context.sendBroadcast(intent);
    }
}

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            createNotificationChannel(notificationManager);

            NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("Background Recording")
                    .setContentText("Recording audio...")
                    .setSmallIcon(R.mipmap.ic_launcher);

            Notification notification = notificationBuilder.build();
            startForeground(NOTIFICATION_ID, notification);
        }

        startRecording();

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        stopRecording();
    }

    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        WritableMap data = Arguments.fromBundle(extras);
        return new HeadlessJsTaskConfig(
                "BackgroundRecordingTask",
                data,
                5000, // Delay in milliseconds before the task is executed (optional)
                true // Allow task in foreground (optional)
        );
        // HeadlessJsTaskConfig.Builder taskConfigBuilder = new HeadlessJsTaskConfig.Builder()
        //         .setTaskId(1) // Provide a unique task ID
        //         .setComponentName(getComponentName())
        //         .setDelay(0)
        //         .setTimeout(0);

        // return taskConfigBuilder.build();
        // HeadlessTaskConfig taskConfig = new HeadlessTaskConfig(
        //         "1", // Provide a unique task ID
        //         "BackgroundRecordingTask", // Name of your background task registered in your React Native code
        //         intent.getExtras(),
        //         0 // Timeout for the task (optional)
        // );

        // return taskConfig.build();
    }


    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

