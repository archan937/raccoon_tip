
namespace :sass do
  desc "Tell Sass to watch and compile RaccoonTip SASS templates when modified"
  task :watch do |task, args|
    `sass --watch src/sass:src --style compressed`
  end
end

desc "Release a new RaccoonTip version"
task :release, :version do |task, args|
  if (args[:version] || "").strip.empty?
    puts "usage: rake release[version]"
    exit
  end
  
  timestamp = Time.now
  javascript = File.open("src/raccoon_tip.js").readlines.collect{ |line|
    line.gsub(/\{(version|year|date|style)\}/) do |matched|
      case matched
      when "{version}"
        args[:version]
      when "{year}"
        timestamp.year.to_s
      when "{date}"
        timestamp.strftime("%Y-%m-%d %H:%M:%S +0100 (%a, %d %B %Y)")
      when "{style}"
        File.read("src/raccoon_tip.css").strip
      end
    end
  }
  
  # Define variables
  releases_dir = "releases"
  release_dir  = "#{releases_dir}/#{args[:version]}"
  
  # Create directories
  FileUtils.rm_r(release_dir) if File.exists?(release_dir)
  FileUtils.mkdir_p("#{release_dir}/jquery")
  
  # Create files
  File.open("#{release_dir}/raccoon_tip.js", "w").puts(javascript)
  FileUtils.cp("src/jquery/core.js", "#{release_dir}/jquery")
  File.open("VERSION", "w").puts(args[:version])

  # Compress release using YUI compressor
  IO.popen "java -jar lib/yuicompressor-2.4.2.jar -v #{release_dir}/raccoon_tip.js -o #{release_dir}/raccoon_tip-min.js"
end
