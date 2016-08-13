/// <reference path="../typings/index.d.ts" />

import * as Args from "./args";
import PlayMusicCache from "./playMusicCache";
import * as Promise from "promise";

export default class Shuffler {
	cache = new PlayMusicCache();

	run(): void {
		this.cache.login(Args.email, Args.password).then(() => {
			this.cache.getPlaylistsByName(Args.input).then((playlists) => {
				this.cache.populatePlaylistTracks(playlists).then(() => {
					const tracks = this.shuffleTracks(this.getUniqueTracks(playlists));
					const playlistsNeeded = Math.ceil(tracks.length / Args.maxTracksPerPlaylist);
					this.getOutputPlaylistNames(playlistsNeeded).then((playlistNames) => {
						const playlistPartitions = this.partitionTracks(tracks, playlistsNeeded);
						let partitionIndex = 0;
						const allPromises = playlistNames.map((playlistName) => {
							const playlistPartition = playlistPartitions[partitionIndex++];
							return this.shufflePlaylist(playlistName, playlistPartition);
						});
						Promise.all(allPromises).done(() => {
							console.log("Playlists have been shuffled.");
							process.exit();
						}, (error) => {
							console.error(error);
							process.exit();
						});
					}, (error) => {
						console.error(error);
						process.exit();
					});
				}, (error) => {
					console.error(error);
					process.exit();
				});
			}, (error) => {
				console.error(error);
				process.exit();
			});
		}, (error) => {
			console.error(error);
			process.exit();
		});
	}

	getOutputPlaylistNames(playlistsNeeded: number): Promise.IThenable<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			this.cache.getAllPlaylists().then((allPlaylists) => {
				const needsIdentifier = playlistsNeeded > Args.output.length;
				const playlistNames: string[] = [];
				for (let i = 0; i < playlistsNeeded; i++) {
					const outputName = Args.output[i % Args.output.length];
					const identifier = Math.ceil((i + 1) / Args.output.length);
					const playlistName = needsIdentifier ? `${outputName} (${identifier})` : outputName;
					if (!Args.overwrite) {
						if (allPlaylists.filter((p) => p.name === playlistName).length > 0) {
							reject("A playlist with the name of '" + playlistName + "' already exists. Specify the --overwrite argument to overwrite the playlist.");
							return;
						}
					}
					playlistNames.push(playlistName);
				}
				resolve(playlistNames);
			}, (error) => {
				reject(error);
			});
		});
	}

	/**
	 * Retrieves an array of all the unique tracks from all the playlists.
	 * 
	 * @param playlists An arary of all the playlists to retrieve all the tracks from.
	 * @returns An array containing all the unique/distinct tracks from all the playlists.
	 */
	getUniqueTracks(playlists: pm.PlaylistListItem[]): pm.PlaylistItem[] {
		const flags = {};
		const tracks: pm.PlaylistItem[] = [];
		playlists.forEach((playlist) => {
			const playlistTracks: pm.PlaylistItem[] = (<any>playlist).tracks;
			playlistTracks.forEach((track) => {
				if (!flags[track.trackId]) {
					flags[track.trackId] = true;
					tracks.push(track);
				}
			});
		});
		return tracks;
	}

	/**
	 * Shuffles the array of tracks. The tracks will be shuffled in place meaning the array being
	 * passed in will be modified.
	 * 
	 * @param tracks The array of tracks to shuffle.
	 * @returns The shuffled array of tracks. Note: this will be the same instance as the array that is passed in.
	 */
	shuffleTracks(tracks: pm.PlaylistItem[]): pm.PlaylistItem[] {
		let currentIndex = tracks.length;
		while (currentIndex !== 0) {
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			const temporaryValue = tracks[currentIndex];
			tracks[currentIndex] = tracks[randomIndex];
			tracks[randomIndex] = temporaryValue;
		}
		return tracks;
	}

	partitionTracks(tracks: pm.PlaylistItem[], playlistsNeeded: number): pm.PlaylistItem[][] {
		const partitions: pm.PlaylistItem[][] = [];
		for (let i = 0; i < playlistsNeeded; i++) {
			const startIndex = i * Args.maxTracksPerPlaylist;
			partitions[i] = tracks.slice(startIndex, startIndex + Args.maxTracksPerPlaylist);
		}
		return partitions;
	}

	shufflePlaylist(playlistName: string, playlistPartition: pm.PlaylistItem[]): Promise.IThenable<void> {
		return new Promise<void>((resolve, reject) => {
			this.cache.getOrCreatePlaylist(playlistName).then((playlist) => {
				this.cache.addTracksToPlaylist(playlist, playlistPartition).then(() => {
					resolve(undefined);
				}, (error) => {
					reject(error);
				});
			}, (error) => {
				reject(error);
			});
		});
	}
}