#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface BackgroundRecordingService : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
@property (nonatomic, assign) BOOL isRecording;
@property (nonatomic, strong) NSString *outputFilePath;

@end

@implementation BackgroundRecordingService

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    _isRecording = NO;
    _outputFilePath = [self getOutputFilePath];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleInterruption:) name:AVAudioSessionInterruptionNotification object:nil];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"BackgroundRecordingEvent"];
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self name:AVAudioSessionInterruptionNotification object:nil];
}

- (void)startRecording {
  AVAudioSession *audioSession = [AVAudioSession sharedInstance];
  [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
  
  NSDictionary *settings = @{
    AVFormatIDKey: @(kAudioFormatMPEG4AAC),
    AVSampleRateKey: @44100.0f,
    AVNumberOfChannelsKey: @2,
    AVEncoderAudioQualityKey: @(AVAudioQualityMedium)
  };

  NSError *error;
  self.audioRecorder = [[AVAudioRecorder alloc] initWithURL:[NSURL fileURLWithPath:self.outputFilePath] settings:settings error:&error];
  
  if (self.audioRecorder) {
    [audioSession setActive:YES error:nil];
    [self.audioRecorder record];
    self.isRecording = YES;
    [self sendRecordingEvent:YES];
  } else {
    NSLog(@"Error initializing audio recorder: %@", error.localizedDescription);
  }
}

- (void)stopRecording {
  if (self.isRecording) {
    [self.audioRecorder stop];
    self.audioRecorder = nil;
    self.isRecording = NO;
    [self sendRecordingEvent:NO];
    
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession setActive:NO error:nil];
  }
}

- (NSString *)getOutputFilePath {
  NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
  NSString *filePath = [documentsDirectory stringByAppendingPathComponent:@"recording.m4a"];
  return filePath;
}

- (void)sendRecordingEvent:(BOOL)isRecording {
  NSDictionary *eventData = @{
    @"isRecording": @(isRecording)
  };
  [self sendEventWithName:@"BackgroundRecordingEvent" body:eventData];
}

- (void)handleInterruption:(NSNotification *)notification {
  AVAudioSessionInterruptionType interruptionType = [notification.userInfo[AVAudioSessionInterruptionTypeKey] unsignedIntegerValue];
  if (interruptionType == AVAudioSessionInterruptionTypeEnded && self.isRecording) {
    AVAudioSessionInterruptionOptions options = [notification.userInfo[AVAudioSessionInterruptionOptionKey] unsignedIntegerValue];
    if (options == AVAudioSessionInterruptionOptionShouldResume) {
      [self startRecording];
    }
  }
}

@end
