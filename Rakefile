desc "Release a new RaccoonTip version"
task :release, :version do |task, args|
  if (args[:version] || "").strip.empty?
    puts "usage: rake release[version]"
    exit
  end

  timestamp  = Time.now
  javascript = File.open("src/raccoon_tip.js").readlines.collect do |line|
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
  end

  # Define variables
  releases_dir = "releases"
  release_dir  = "#{releases_dir}/#{args[:version]}"
  latest_dir   = "#{releases_dir}/latest"

  # Create directories
  FileUtils.rm_r(release_dir) if File.exists?(release_dir)
  FileUtils.mkdir_p("#{release_dir}/jquery")

  # Create files
  FileUtils.cp("README.textile", "#{release_dir}/README.textile")
  FileUtils.cp("src/jquery/core.js", "#{release_dir}/jquery")
  File.open("#{release_dir}/raccoon_tip.js", "w").puts(javascript)
  File.open("VERSION", "w").puts(args[:version])

  # Compress release using YUI compressor
  IO.popen "java -jar lib/yuicompressor-2.4.2.jar -v #{release_dir}/raccoon_tip.js -o #{release_dir}/raccoon_tip.min.js"

  # Update latest release dir
  FileUtils.rm_r(latest_dir) if File.exists?(latest_dir)
  FileUtils.cp_r("#{release_dir}/.", latest_dir)
end

namespace :sass do
  desc "Tell Sass to watch and compile RaccoonTip SASS templates when modified"
  task :watch do |task, args|
    `sass --watch src/sass:src --style compressed`
  end
end