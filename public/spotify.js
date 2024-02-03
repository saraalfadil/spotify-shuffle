(function() {
	let params = getHashParams();

	let accessToken = params.access_token;
	let error = params.error;

	let userId = '';

	let includeAllPlaylists = false;
	let includeLikedTracks = true;

    /*
        Pull a list of all my playlists
    */
    const getPlaylists = function(accessToken, userId, ownedOnly) {

        $.ajax({
            url: '/playlists',
            data: {
                'access_token': accessToken,
                'user_id': userId
            }
            }).done(function(data) {
            
            let allPlaylists = data.playlists;
            let playlists = filterPlaylists(allPlaylists, ownedOnly);

            displayPlaylistSelection(playlists);

        });

    }

    // Filter playlists based on "My playlists only" selection
    const filterPlaylists = function(allPlaylists, ownedOnly) {
        let playlists = allPlaylists.filter(playlist => {

            let owner = playlist.owner;
            let ownedPlaylist = owner && owner.id == userId;

            if(ownedPlaylist) 
                return playlist;

        });

        if (ownedOnly)
            return playlists;
        else 
            return allPlaylists;
    }

    const displayPlaylistSelection = function(allPlaylists) {

        let playlistsList = document.getElementById('playlists');
        let playlistsHTML = "";

        allPlaylists.forEach(playlist => {

            let tracks = playlist?.tracks;
            let owner = playlist.owner;
            let ownedPlaylist = owner && owner.id == userId;

            let playlistNameClass = ownedPlaylist ? 'owned-playlist' : 'other-playlist';
            let checkBoxHTML = `<li>
            <input type="checkbox" class="playlist-checkbox" name="playlist[]" value="${tracks?.href}" checked/><span class="${playlistNameClass}">${playlist?.name}</span></li>`;

            playlistsHTML += checkBoxHTML;

        });

        playlistsList.innerHTML = playlistsHTML;
        
    }
    
    /*
      Get information about the currently playing track
    */
    const getPlayerInfo = function(accessToken) {

      $.ajax({
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        type: 'GET',
        dataType: 'json',
        contentType: "application/json",
        success: function(response) {
        
            showNowPlaying(response?.item);

        },
        error: function(xhr, status, error) {
          console.log('error: ', xhr.responseText);
        }
      });
    
    }

	const showNowPlaying = function(track) {

        let artistNames = track?.artists.map(artist => artist?.name);
        let artistNameDisplay = artistNames.join(", ");

        let artistName = document.getElementById('artistName');
        let songName = document.getElementById('songName');
        artistName.innerHTML = artistNameDisplay;
        songName.innerHTML = track?.name;
		
	}

    /*
      Initiate playback on the active user device
    */
    const playTracks = function(tracks, userId) {

      $.ajax({
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        type: 'PUT',
        data: JSON.stringify({
            uris: tracks
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function(response) {

            getPlayerInfo(accessToken, userId);

            $('.spinner-icon').addClass('hidden');
            $('.shuffle-icon').removeClass('hidden');
                document.getElementById('shuffleText').innerText = 'Shuffle';

        },
        error: function(xhr, status, error) {
            console.log('error: ', xhr.responseText);
        }
      });
    
    }

    const getUserInfo = function(accessToken) {

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            userId = response.id;

            // Get a list of all my playlists
            getPlaylists(accessToken, userId, true);

            // Find out what is playing right now
            getPlayerInfo(accessToken, userId);
            
            // Display authenticated page
            $('#login').hide();
            $('#loggedin').show();

        },
        error: function(xhr, status, error) {
            console.log('error: ', xhr.responseText);
        }
        });
    
    }

    const toggleMyPlaylistsOnly = function() {
		let myPlaylistsOnly = this.checked;
		let myPlaylistsOnlyValue = document.getElementById('myPlaylistsOnlyValue');

		if(myPlaylistsOnly) {
			myPlaylistsOnlyValue.innerHTML = "ON";
		} else {
			myPlaylistsOnlyValue.innerHTML = "OFF";
		}

		// Refresh list of playlists
		getPlaylists(accessToken, userId, myPlaylistsOnly);
    }


    const toggleIncludeLikedTracks = function() {
		let includeLikedTracksValue = document.getElementById('includeLikedTracksValue');

		if(this.checked) {
			includeLikedTracksValue.innerHTML = "ON";
		} else {
			includeLikedTracksValue.innerHTML = "OFF";
		}
    };

    const toggleChoosePlaylists = function() {
		let choosePlaylistsValue = document.getElementById('choosePlaylistsValue');
		let playlistsContainer = document.getElementById('playlistsContainer');

		if(this.checked) {
			choosePlaylistsValue.innerHTML = "ON";
			playlistsContainer.style.display = "block";

		} else {
			choosePlaylistsValue.innerHTML = "OFF";
			playlistsContainer.style.display = "none";
		}
    }

    // Add ability to select/deselect playlists
    const toggleSelectAllPlaylists = function() {
        if(this.checked) {
          document.querySelectorAll('.playlist-checkbox').forEach(checkbox => {
            checkbox.checked = true;
          });
        } else {
          document.querySelectorAll('.playlist-checkbox').forEach(checkbox => {
            checkbox.checked = false;
          });
        }
    }
  /*
    Retrieve a list of shuffled tracks
  */
    const shuffle = function() {
      $('.spinner-icon').removeClass('hidden');
      $('.shuffle-icon').addClass('hidden');
      document.getElementById('shuffleText').innerText = 'Shuffling...';

      // Get iterable list of selected checkboxes elements
      let playlistItems = Array.from(document.getElementsByName('playlist[]'));
      let selectedPlaylists = playlistItems.filter((item) => item.checked);
      let filterPlaylists = selectedPlaylists.map((item) => item.value);

      $.ajax({
        url: '/shuffle',
        data: {
          'access_token': accessToken,
          'user_id': userId,
          'include_all_playlists': includeAllPlaylists,
          'include_liked_tracks': includeLikedTracks,
          //'filter_playlists': filter_playlists
        }
      }).done(function(data) {
        
        if(data.all_tracks) {
          playTracks(data.all_tracks, userId);
        }

      });
      
    }

    document.getElementById('selectAllPlaylists').addEventListener('click', toggleSelectAllPlaylists, false);

    // Enable "Shuffle" button
    document.getElementById('shuffle').addEventListener('click', shuffle, false);

    // Toggle "My playlists only" checkbox
    document.getElementById('myPlaylistsOnlyCheckbox').addEventListener('change', toggleMyPlaylistsOnly, false);

    // Toggle "Include like tracks" checkbox
    document.getElementById('includeLikedTracksCheckbox').addEventListener('change', toggleIncludeLikedTracks, false);

    // Toggle "Choose playlists" checkbox
    document.getElementById('choosePlaylistsCheckbox').addEventListener('change', toggleChoosePlaylists, false);

    if (error) {
      alert('There was an error authenticating');
    } else {
      if (accessToken) {

        getUserInfo(accessToken);

      } else {
          $('#login').show();
          $('#loggedin').hide();
      }
    }
})();