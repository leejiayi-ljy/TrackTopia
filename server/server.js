require("dotenv").config();

const express = require('express');
const axios = require('axios');
const cors = require("cors");
const bodyParser = require('body-parser');
const querystring = require('querystring');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// redirects to get code url param
app.get('/login', function (req, res) {
    var scope = 'streaming user-read-email user-read-private user-read-email user-library-read user-library-modify user-top-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }));
});

// get access token, refresh token and expires in
app.post('/callback', async (req, res) => {
    try {
        const code = req.body.code;

        var client_id = process.env.SPOTIFY_CLIENT_ID;
        var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        var redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            data: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true
        };

        const response = await axios(authOptions);

        if (response.status === 200) {
            const { access_token, refresh_token, expires_in } = response.data;
            res.status(200).json({
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresIn: expires_in
            });
        } else {
            res.status(400).json({
                error: 'Invalid authorization code'
            });
        }
    } catch {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// automatically refreshes access token using refresh token when expires
app.post('/refresh', async (req, res) => {
    try {
        var client_id = process.env.SPOTIFY_CLIENT_ID;
        var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const refresh_token = req.body.refreshToken;
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        const response = await axios(authOptions);

        if (response.status === 200) {
            const { access_token, expires_in } = response.data;
            res.status(200).json({
                accessToken: access_token,
                expiresIn: expires_in
            });
        } else {
            res.status(400).json({
                error: 'Failed to refresh access token'
            });
        }
    } catch {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


app.post('/me', async (req, res) => {
    try {
        const access_token = req.body.accessToken;
        const authOptions = {
            url: 'https://api.spotify.com/v1/me',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        };
        const response = await axios(authOptions);

        if (response.status === 200) {
            const { id, display_name, images } = response.data;
            res.status(200).json({
                id: id,
                displayName: display_name,
                images: images
            });
        } else {
            res.status(400).json({
                error: 'Failed to refresh access token'
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


app.post('/top', async (req, res) => {
    try {
        const { type, timeRange: time_range, limit, offset, accessToken: access_token } = req.body;
        const authOptions = {
            url: `https://api.spotify.com/v1/me/top/${type}?` +
                querystring.stringify({
                    time_range: time_range ? time_range : 'short_term',
                    limit: limit ? limit : 5,
                    offset: offset ? offset : 0,
                }),
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        };

        const response = await axios(authOptions);
        if (response.status === 200) {
            res.status(200).json({
                itemList: response.data.items
            });
        } else {
            res.status(400).json({
                error: `Failed to fetch top ${type}`
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.post('/trackFeatures', async (req, res) => {
    try {
        const { trackId: id, accessToken: access_token } = req.body;

        const authOptions = {
            url: `https://api.spotify.com/v1/audio-features/${id}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        };

        const response = await axios(authOptions);
        if (response.status === 200) {
            const { id, acousticness, danceability, energy, instrumentalness, key, liveness, loudness, speechiness, tempo, valence } = response.data;

            res.status(200).json({
                id, acousticness, danceability, energy, instrumentalness, key, liveness, loudness, speechiness, tempo, valence
            });
        } else {
            res.status(400).json({
                error: 'Failed to fetch track features'
            });
        }
    } catch {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.post('/recommendations', async (req, res) => {
    try {
        const {
            limit: limit,
            accessToken: access_token,
            artistIds: seed_artists,
            trackId: seed_tracks,
            trackFeatures: {
                acousticness: target_acousticness,
                danceability: target_danceability,
                energy: target_energy,
                instrumentalness: target_instrumentalness,
                key: target_key,
                liveness: target_liveness,
                loudness: target_loudness,
                speechiness: target_speechiness,
                tempo: target_tempo,
                valence: target_valence,
            }
        } = req.body;

        const authOptions = {
            url: `https://api.spotify.com/v1/recommendations`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            params: {
                limit: limit,
                seed_artists: seed_artists,
                seed_tracks: seed_tracks,
                // target_acousticness: target_acousticness,
                min_acousticness: Math.min(target_acousticness - 0.1, 0),
                max_acousticness: Math.max(target_acousticness + 0.1, 1),
                // target_danceability: target_danceability,
                min_danceability: Math.min(target_danceability - 0.1, 0),
                max_danceability: Math.max(target_danceability + 0.1, 1),
                // target_energy: target_energy,
                min_energy: Math.min(target_energy - 0.1, 0),
                max_energy: Math.max(target_energy + 0.1, 1),
                // target_instrumentalness: target_instrumentalness,
                min_instrumentalness: Math.min(target_instrumentalness - 0.1, 0),
                max_instrumentalness: Math.max(target_instrumentalness + 0.1, 1),
                // target_key: target_key,
                min_key: Math.min(target_key - 2, 0),
                max_key: Math.max(target_key + 2, 11),
                // target_liveness: target_liveness,
                min_liveness: Math.min(target_liveness - 0.2, 0),
                max_liveness: Math.max(target_liveness + 0.2, 1),
                target_loudness: target_loudness,
                // min_loudness: target_loudness - 10,
                // max_loudness: target_loudness + 10,
                // target_speechiness: target_speechiness,
                min_speechiness: Math.min(target_speechiness - 0.2, 0),
                max_speechiness: Math.max(target_speechiness + 0.2, 1),
                // target_tempo: target_tempo,
                min_tempo: target_tempo - 10,
                max_tempo: target_tempo + 10,
                // target_valence: target_valence,
                min_valence: Math.min(target_valence - 0.2, 0),
                max_valence: Math.max(target_valence + 0.2, 1)
            },
        };

        const response = await axios(authOptions);
        if (response.status === 200) {
            const { tracks } = response.data;

            res.status(200).json({
                tracks: tracks
            });
        } else {
            res.status(400).json({
                error: 'Failed to fetch track recommendations'
            });
        }
    } catch {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


app.post('/saveTrack', async (req, res) => {
    try {
        const {
            accessToken: access_token,
            trackId: id,
        } = req.body;

        const authOptions = {
            url: `https://api.spotify.com/v1/me/tracks`,
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            params: {
                ids: id,
            },
            data: {
                ids: [id]
            },
            json: true
        };

        const response = await axios(authOptions);
        if (response.status === 200) {
            res.status(200).json({
                statusText: 'Saved'
            });
        } else {
            res.status(400).json({
                error: 'Failed to save track'
            });
        }
    } catch {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


app.post('/searchTrack', async (req, res) => {
    try {
        const {
            accessToken: access_token,
            query: q,
        } = req.body;

        const authOptions = {
            url: `https://api.spotify.com/v1/search?` +
                querystring.stringify({
                    q: q,
                    type: 'track',
                }),
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
        };

        const response = await axios(authOptions);
        if (response.status === 200) {
            res.status(200).json({
                itemList: response.data.tracks.items
            });
        } else {
            res.status(400).json({
                error: 'Failed to save track'
            });
        }
    } catch {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});