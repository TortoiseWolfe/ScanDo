Pod::Spec.new do |s|
  s.name           = 'ScandoLidar'
  s.version        = '1.0.0'
  s.summary        = 'LiDAR scanning native module for AsBuilt LiDAR'
  s.description    = 'ARKit scene reconstruction and mesh extraction for iPhone Pro LiDAR scanning.'
  s.author         = ''
  s.homepage       = 'https://github.com/TortoiseWolfe/ScanDo'
  s.platforms      = {
    :ios => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
