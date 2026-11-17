#!/usr/bin/env bash
# Run this inside your website folder (the one that contains the "assets" directory).
# Shrinks the images that were not part of the upload, in place. Same file names, so no HTML changes needed.
# Needs ImageMagick:  sudo apt install imagemagick   (Mac: brew install imagemagick)
set -e
cp -r assets assets_backup_$(date +%s)

# Site photos: max 1400px wide, JPEG quality 78
for f in assets/siri-vanam/*.jpg assets/extracted/image-*.jpg; do
  [ -f "$f" ] && mogrify -resize '1400x>' -strip -interlace Plane -quality 78 "$f"
done

# Header logo (shown at 60px): 200px is plenty
[ -f assets/extracted/image-e87ca014f2c27ce6.png ] && \
  mogrify -resize '200x200>' -strip assets/extracted/image-e87ca014f2c27ce6.png

echo "Done. Backup folder created next to assets/."
