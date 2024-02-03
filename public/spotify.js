(function() {
	let params = getHashParams();

	let access_token = params.access_token,
		error = params.error;

	let user_id = '';

	let include_all_playlists = false;
	let include_liked_tracks = true;
	let choose_playlists = false;

  /*
    Pull a list of all my playlists
  */
  const getPlaylists = function(access_token, user_id, owned_only) {

    $.ajax({
      url: '/playlists',
      data: {
        'access_token': access_token,
        'user_id': user_id
      }
    }).done(function(data) {
      
      let all_playlists = [];
      let playlists = data.playlists;

      for(let i = 0; i < playlists.length; i++) {

        var playlist = playlists[i];
        let owner = playlist.owner;
        let owned_playlist = owner && owner.id == user_id;
        playlist.owned_playlist = owned_playlist;

        if(owned_only) {
          
          if(owned_playlist)
            all_playlists.push(playlist);

        } else {

          all_playlists.push(playlist);

        }

      }

      let playlistsList = document.getElementById('playlists');
      let playlistsHTML = "";

      for(let j = 0; j < all_playlists.length; j++) {

          let playlist = all_playlists[j];
          let tracks = playlist?.tracks;
          let owned_playlist = playlist?.owned_playlist;

          let playlistNameClass = owned_playlist ? 'owned-playlist' : 'other-playlist';
          let checkBoxHTML = `<li>
          <input type="checkbox" class="playlist-checkbox" name="playlist[]" value="${tracks?.href}" checked/><span class="${playlistNameClass}">${playlist?.name}</span></li>`;

          playlistsHTML += checkBoxHTML;
      }

      playlistsList.innerHTML = playlistsHTML;

      // Add ability to select/deselect playlists
      $('input[name=select_all]').off('change').on('change', function() {
        let select_all = $('input[name=select_all]').is(':checked');

        if(select_all) {
          document.querySelectorAll('.playlist-checkbox').forEach(checkbox => {
            checkbox.checked = true;
          });
        } else {
          document.querySelectorAll('.playlist-checkbox').forEach(checkbox => {
            checkbox.checked = false;
          });
        }
      });

    });

  }
    
    /*
      Get information about the currently playing track
    */
    const getPlayerInfo = function(access_token) {

      $.ajax({
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
          'Authorization': 'Bearer ' + access_token
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

		let artists = track?.artists;
		let artistName = document.getElementById('artistName');
		let songName = document.getElementById('songName');
		let artistNames = artists.map(artist => artist?.name);
		let artistNameDisplay = artistNames.join(", ");

		artistName.innerHTML = artistNameDisplay;
		songName.innerHTML = track?.name;
		
	}

    /*
      Initiate playback on the active user device
    */
    const playTracks = function(tracks, user_id) {

	let jsonData = JSON.stringify({
		uris: tracks
	});

      $.ajax({
          url: 'https://api.spotify.com/v1/me/player/play',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          type: 'PUT',
          data: jsonData,
          dataType: 'json',
          contentType: "application/json",
          success: function(response) {
            
            getPlayerInfo(access_token, user_id);

            $('.spinner-icon').addClass('hidden');
            $('.shuffle-icon').removeClass('hidden');
            document.getElementById('shuffleText').innerText = 'Shuffle';
            
          },
          error: function(xhr, status, error) {
            console.log('error: ', xhr.responseText);
          }
      });
    
    }

    const getUserInfo = function(access_token) {

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          user_id = response.id;

          // Get a list of all my playlists
          getPlaylists(access_token, user_id, true);

          // Find out what is playing right now
          getPlayerInfo(access_token, user_id);
          
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
		my_playlists_only = this.checked;

		let my_playlists_only_value = document.getElementById('myPlaylistsOnlyValue');
		if(my_playlists_only) {
			my_playlists_only_value.innerHTML = "ON";
		} else {
			my_playlists_only_value.innerHTML = "OFF";
		}

		// Refresh list of playlists
		getPlaylists(access_token, user_id, my_playlists_only);
    }


    const toggleIncludeLikedTracks = function() {
		include_liked_tracks = this.checked;

		let include_liked_tracks_value = document.getElementById('includeLikedTracksValue');
		if(include_liked_tracks) {
			include_liked_tracks_value.innerHTML = "ON";
		} else {
			include_liked_tracks_value.innerHTML = "OFF";
		}
    };

    const toggleChoosePlaylists = function() {
		choose_playlists = this.checked;

		let choose_playlists_value = document.getElementById('choosePlaylistsValue');
		let playlists_container = document.getElementById('playlistsContainer');

		if(choose_playlists) {
			choose_playlists_value.innerHTML = "ON";
			playlists_container.style.display = "block";

		} else {
			choose_playlists_value.innerHTML = "OFF";
			playlists_container.style.display = "none";
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
      let playlist_items = Array.from(document.getElementsByName('playlist[]'));
      let selected_playlists = playlist_items.filter((item) => item.checked);
      let filter_playlists = selected_playlists.map((item) => item.value);

      $.ajax({
        url: '/shuffle',
        data: {
          'access_token': access_token,
          'user_id': user_id,
          'include_all_playlists': include_all_playlists,
          'include_liked_tracks': include_liked_tracks,
          //'filter_playlists': filter_playlists
        }
      }).done(function(data) {
        
        if(data.all_tracks) {
          playTracks(data.all_tracks, user_id);
        }

      });
      
    }

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
      if (access_token) {

        getUserInfo(access_token);

      } else {
          $('#login').show();
          $('#loggedin').hide();
      }
    }
})();