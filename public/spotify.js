(function() {
    var playerSource = document.getElementById('player-template').innerHTML,
        playerTemplate = Handlebars.compile(playerSource),
        playerPlaceholder = document.getElementById('player');
    
    var playlistSource = document.getElementById('playlist-template').innerHTML,
        playlistTemplate = Handlebars.compile(playlistSource),
        playlistPlaceholder = document.getElementById('playlists');

    var params = getHashParams();

    var access_token = params.access_token,
        error = params.error;

    var user_id = '';

    var include_all_playlists = 0;
    var include_liked_tracks = 0;

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

        playlistPlaceholder.innerHTML = playlistTemplate(all_playlists);

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
          
          playerPlaceholder.innerHTML = playerTemplate(response.item);

        },
        error: function(xhr, status, error) {
          console.log('error: ', xhr.responseText);
        }
      });
    
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

            $('.loading').addClass('hidden');
            
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

    if (error) {
      alert('There was an error authenticating');
    } else {
      if (access_token) {

        getUserInfo(access_token);

        $('input[name=include_all_playlists]').off('change').on('change', function() {
          include_all_playlists = $('input[name=include_all_playlists]:checked').val();

          let owned_only = include_all_playlists == 0 ? true : false;

          // Refresh list of playlists
          getPlaylists(access_token, user_id, owned_only);
        });

        $('input[name=include_liked_tracks]').off('change').on('change', function() {
          include_liked_tracks = $('input[name=include_liked_tracks]').is(':checked');
        });
      
      } else {
          $('#login').show();
          $('#loggedin').hide();
      }
  

      /*
        Retrieve a list of shuffled tracks
      */
      const shuffle = function() {
        $('.loading').removeClass('hidden');

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

      document.getElementById('shuffle').addEventListener('click', shuffle, false);

    }
})();