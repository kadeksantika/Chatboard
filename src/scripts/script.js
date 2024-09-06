$(document).ready(function () {
    // Initial load
    var sortOrder = $('#customCheckbox').is(':checked') ? 'desc' : 'asc';
    var initialRoom = $('#input-room').val();
    loadChat(initialRoom, sortOrder);

    // Function untuk active/nonactivekan sidebar
    $('#menu-toggle-btn').click(function () {
        const $sidebar = $('#sidebar');
        if ($sidebar.hasClass('md:active')) {
            $sidebar.removeClass('md:active');
        } else {
            $sidebar.addClass('md:active');
        }
    });

    // Fungsi untuk fecth chat berdasarkan roomchat
    function loadChat(roomName, sortOrder = 'asc', searchTerm = '') {
        $.ajax({
            url: 'fetch_chat.php',
            type: 'GET',
            data: { room: roomName, offset: 0, limit: 10, sort: sortOrder, search: searchTerm },
            success: function (data) {
                $('#chat-container').html(data);

                // Get the average char count from window.chatData
                if (window.chatData && window.chatData.averageCharCount !== undefined) {
                    $('#room-avg').text(window.chatData.averageCharCount + ' char');
                }

                // Scroll to bottom
                $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error: ' + status + error);
            }
        });
    }
    
    // Sorting berdasarkan date
    $('#sort-btn').click(function () {
        var $checkbox = $('#customCheckbox');
        var isChecked = $checkbox.is(':checked');

        // Toggle checkbox state
        $checkbox.prop('checked', !isChecked);

        // Determine sort order
        var newSortOrder = !isChecked ? 'desc' : 'asc';

        if (isChecked) {
            $("#sort-btn").removeClass("active");
        } else {
            $("#sort-btn").addClass("active");
        }

        // Load chat data with updated sort order
        loadChat($('#input-room').val(), newSortOrder, $('#search-input').val());
    });

    // Search fitur
    $('#search-input').on('input', function () {
        var searchTerm = $(this).val();
        loadChat($('#input-room').val(), $('#customCheckbox').is(':checked') ? 'desc' : 'asc', searchTerm);
    });

    // Prevent form submission from refreshing the page
    $('#form-search').on('submit', function (e) {
        e.preventDefault(); // Prevent the form from submitting normally
    });
    // Melakukan Submit chat
    $('#form-chat').on('submit', function (e) {
        e.preventDefault();
        var name = $(this).find('input[name="name"]').val();
        var message = $(this).find('input[name="message"]').val();
        var room = $('#input-room').val();

        if (name && message) {
            $.ajax({
                url: 'save_data.php',
                type: 'POST',
                data: {
                    name: name,
                    message: message,
                    room: room
                },
                success: function () {
                    loadChat(room, $('#customCheckbox').is(':checked') ? 'desc' : 'asc', $('#search-input').val());
                    $('#form-chat')[0].reset();
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error: ' + status + error);
                }
            });
        } else {
            alert('Name and message cannot be empty!');
        }
    });



    // Fungsi pilih menu
    function toggleMenu(menu) {
        var room, logoSrc;
        switch (menu) {
            case 1:
                $('#menu-item-1').addClass("active");
                $('#menu-item-2').removeClass("active");
                $('#menu-item-3').removeClass("active");
                room = "Adventure";
                logoSrc = 'src/images/camping.png';
                break;
            case 2:
                $('#menu-item-1').removeClass("active");
                $('#menu-item-2').addClass("active");
                $('#menu-item-3').removeClass("active");
                room = "Game";
                logoSrc = 'src/images/console-controller.png';
                break;
            case 3:
                $('#menu-item-1').removeClass("active");
                $('#menu-item-2').removeClass("active");
                $('#menu-item-3').addClass("active");
                room = "Study";
                logoSrc = 'src/images/diary-bookmark-down.png';
                break;
        }
        $('#room-name').text(room);
        $('#room-logo').attr('src', logoSrc);
        $('#input-room').val(room);

        // Load chat data for the selected room
        loadChat(room, $('#customCheckbox').is(':checked') ? 'desc' : 'asc', $('#search-input').val());
    }


    // Event listener untuk setiap menu
    $('#menu-item-1').click(function () {
        toggleMenu(1);
    });

    $('#menu-item-2').click(function () {
        toggleMenu(2);
    });

    $('#menu-item-3').click(function () {
        toggleMenu(3);
    });

    // Event listener to toggle sidebar
    $('#menu-toggle-btn').click(function () {
        $('#sidebar').toggleClass('active');
    });
});