# shuffler

Description
----
This script will shuffle multiple Google Play Music playlists together. For instance, if playlist 1 has 10 songs and playlist 2 has 20 songs, then this script will create playlist 3 containing all 30 songs in a shuffled order. Playlist 3 can then be played sequentially or shuffled again.

Why Use This?
----
Google Play Music already allows playlists to be shuffled when being played. I, however, have come across a problem with their song limits being an avid music listener. When I come across songs that I want to listen to again, I add them to playlist 1. This was great until I reached the 1000 song limit per playlist. To workaround this, I filled up playlist 1 with 1000 songs and then created playlist 2. As of right now, this playlist has about 500 additional songs. I want to listen to both playlist 1 and playlist 2 shuffled together. Again, Google Play Music's queue limit is 1000 songs. To workaround this, I shuffle playlist 1 and listen to it all the way through. I will, then, shuffle playlist 2 and listen to it all the way through. I noticed I was growing an affinity together playlist 2 as it contained the newer songs I was adding to my playlists. This led me to not listen to playlist 1 as much. To workaround this, I created this script. This script will take the 1000 songs from playlist 1 and the 500 songs from playlist 2 in my example and will shuffle them altogether. It will then create playlist 3 with 1000 songs and playlist 4 with 500 songs. Since the songs are shuffled altogether, each song from playlist 1 and playlist 2 have an equal probability of ending up in either playlist 3 or playlist 4. This means the newer songs I was adding to playlist 2 are now mixed in with the older songs from playlist 1. Now, I can listen to playlist 3 sequentially followed by playlist 4 sequentially, and I will have a mix of older and newer songs.

Developer Setup
----
1. Use `git clone` to clone the GitHub repository
1. In the root directory of the module, run: `npm install`

End-User Usage
----
_Note: I do not plan on making this end-user friendly with a GUI._

1. Install Node.js
    * Manual install: http://www.nodejs.org
    * Chocolatey (for Windows): `choco install nodejs.install`
1. In the root directory of the module, run: `npm install`
1. Run the script `node build/index.js -a <ANDROID-ID> -t <TOKEN> -i <PLAYLIST>`

Script Options
----
**-a / --androidId**

_Required._ Specifies the android ID to login with. 


**-t / --token**

_Required._ Specifies the token to login with.


**-i / --input**

_Required._ The names of the playlists to shuffle. Multiple playlists require multiple options defined: `-i "Playlist 1" -i "Playlist 2"`


**-o / --output**

_Optional._ The names to create the shuffled playlists with. Multiple playlists require multiple options defined: `-o "Playlist 1 Shuffled" -o "Playlist 2 Shuffled"`


**--overwrite**

_Optional._ Defaults to false. If any of the output playlists already exists, then they this flag specifies if they will be overwritten or if the script will stop. No value needs to be specified with this option: `--overwrite`

**-m / --maxTracksPerPlaylist**

_Optional._ Defaults to 1000. The maximum number of tracks to put into each generated playlist.

**--singlePlaylist**

_Optional._ Defaults to false. This flag specifies that only one playlist will be created. No value needs to be specified with this option: `--singlePlaylist`

Attribution
----
Thanks to the [Node-JS Google Play Music API](https://github.com/jamon/playmusic) node module for making this script possible.
