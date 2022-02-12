import env from "react-dotenv";
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: env.CLIENT_ID
})

export default function SearchSamplesOnSpotify(searchSampledSong, code) {
    spotifyApi.setAccessToken(code)
    
    return new Promise((resolve, reject) => {
        let type = searchSampledSong.substring(searchSampledSong.indexOf('0^x')+3, 
                                               searchSampledSong.indexOf('0^y'));
        searchSampledSong = searchSampledSong.substring(searchSampledSong.indexOf('0^y')+3, 
                                                        searchSampledSong.length)
        spotifyApi.searchTracks(searchSampledSong)
        .then(res => {
            let song = res.body.tracks.items[0];
            if (song) {
                let songName = song.name.replace('The ', '')
                    .replace('-', '').replace(/\([^()]*\)/g, '')
                    .replace("'", '').toLowerCase();
                if (searchSampledSong.includes(songName) || songName.includes(searchSampledSong)) {
                    resolve({"title": song.name,
                            "artist": song.artists[0].name,
                             "uri": song.uri,
                            "albumUrl": song.album.images[0].url,
                            "type": type})}
                }}, (error) => {
                    reject(error);
            })
        })
    }