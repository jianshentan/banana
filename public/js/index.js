var ACTIVE = 1,
    IDLE = 0;

var postData = {
    "a01": ACTIVE, 
    "a02": ACTIVE, 
    "a03": ACTIVE, 
    "a04": ACTIVE, 
    "a05": ACTIVE, 
    "a06": ACTIVE, 
    "a07": ACTIVE, 
    "a08": ACTIVE, 
    "a09": ACTIVE, 
    "a10": ACTIVE, 
    "a11": ACTIVE, 
    "a12": ACTIVE
}

$( document ).ready(function() {

    // sticky nav
    var nav = $( '#nav' );
    var navPos = nav.offset().top;
    $( window ).scroll(function() {
        if ( $( window ).scrollTop() >= navPos ) {
            nav.css({
                "position": "fixed",
                "top": "0",
                "margin-top": "0",
                "background-color": "white"
            });
        } else {
            nav.css({
                "position": "relative",
                "top": "",
                "margin-top": "179px",
                "background-color": "white"
            });
        }
    }); 

    // detail modal 
    $( ".post" ).each( function(i, el) {
        $( this ).click( function( e ) {
            // this checks that the event target is the same as the clicked-on element
            if ( !$( e.target ).parent().is( $( this ) ) ) return;

            var closeModal = function() {
                $( "#detail-modal-background" ).css( "display", "none" );
                $( "body" ).css( "overflow", "scroll" );
                $( "#detail-buy-email" ).val( "" );
                $( "#detail-buy-progress" ).css( "width", "0" );
                $( "#detail-buy-progress" ).html( "" );
            }

            customizeModal( $( this ) );
            $( "#detail-modal-background" ).css( "display", "block" );  
            $( "body" ).css( "overflow", "hidden" );
            $( "#close-detail-modal" ).one( 'click', closeModal );

            var post = $( this );
            $( "#detail-buy-submit" ).click( function() {
                var input = $( "#detail-buy-email" );
                var inputValue = input.val();

                if (validateEmail( inputValue ) ) {
                    $( "#detail-buy-progress" ).animate({ width: '350px' }, 1000, function() {
                        $( "#detail-buy-progress" ).html( "Thanks" );
                        setPostIdle( post );
                    });
                } else {
                    input.attr( "placeholder", "invalid email" );
                    input.val( "" );
                }
            });
        });
    });

    // buy modal
    $( ".buy" ).each( function( i, e ) {
        var post = $( this ).parent().parent();
        var postId = post.attr( "id" );

        if ( postData[ postId ] === ACTIVE ) {
            $( this ).on( 'click', function( e ) {
                console.log(postId);
                var closeModal = function() {
                    $( "#buy-progress" ).css( "width", "0" );
                    $( "#buy-progress" ).html( "" );
                    $( "#buy-email" ).val( "" );
                    $( "#buy-modal-background" ).css( "display", "none" );
                    $( "body" ).css( "overflow", "scroll" );
                }

                $( "#buy-modal-background" ).css( "display", "block" );
                $( "body" ).css( "overflow", "hidden" );

                var that = $(this);

                $( "#buy-submit" ).click(function() {
                    var input = $( "#buy-email" );
                    var inputValue = input.val();

                    if (validateEmail( inputValue ) ) {
                        $( "#buy-progress" ).animate({ width: '379px' }, 1000, function() {
                            $( "#buy-progress" ).html( "Thanks" );
                            setTimeout( closeModal, 2000 );
                            setPostIdle( post );
                        });
                    } else {
                        input.attr( "placeholder", "invalid email" );
                        input.val( "" );
                    }
                })

                $( "#close-buy-modal" ).one( 'click', closeModal );
            });
        }
    });

    // subscribe on-enter
    $( "#subscribe-button" ).click( function() { 
        var input = $( "#subscribe > input" );
        var inputValue = input.val();

        if ( validateEmail( inputValue ) ) {
            $( '#subscribe-progress' ).animate({ width: '416px' }, 1000, function() {
                $( "#subscribe-progress" ).html( "Thanks" );    
            });
        } else {
            input.attr( "placeholder", "invalid email" );
            input.val( "" );
        }
    });
});

function setPostIdle( post ) {
    var postId = post.attr( "id" );
    var buyBtn = $( post ).find( ".buy" );
    buyBtn.unbind( "click" );
    buyBtn.addClass( "dead" );
    postData[ postId ] = IDLE;
};

// this function takes in the post object that was selected
function customizeModal( post ) {
    var modal = $( "#detail-modal" );
    var modalImg = modal.find( "img" );

    if ( postData[ post.attr( 'id' )  ] === IDLE ) {
        $( "#detail-buy-progress" ).css("width", "350px");
        $( "#detail-buy-progress" ).html( "Thanks" );
    } else {
        $( "#detail-buy-progress" ).css("width", "0px");
        $( "#detail-buy-progress" ).html( "" );
        $( "#detail-buy-email" ).val( "" );
    }

    switch ( post.attr( 'id' ) ) {
        case "a01" :
            modalImg.attr( "src", "media/B01.png" );
            modal.css( "background-color", "#79A594" ); 
            break;
        case "a02" :
            modalImg.attr( "src", "media/B02.png" );
            modal.css( "background-color", "#D4A7C6" );
            break;
        case "a03" :
            modalImg.attr( "src", "media/B03.png" );
            modal.css( "background-color", "#83EEE6" );
            break;
        case "a04" :
            modalImg.attr( "src", "media/B04.png" );
            modal.css( "background-color", "#A09CB7" );
            break;
        case "a05" :
            modalImg.attr( "src", "media/B05.png" );
            modal.css( "background-color", "#CF786F" );
            break;
        case "a06" :
            modalImg.attr( "src", "media/B06.png" );
            modal.css( "background-color", "#F5E472" );
            break;
        case "a07" :
            modalImg.attr( "src", "media/B07.png" );
            modal.css( "background-color", "#8A617F" );
            break;
        case "a08" :
            modalImg.attr( "src", "media/B08.png" );
            modal.css( "background-color", "#EF83B7" );
            break;
        case "a09" :
            modalImg.attr( "src", "media/B09.png" );
            modal.css( "background-color", "#90BA7B" );
            break;
        case "a10" :
            modalImg.attr( "src", "media/B10.png" );
            modal.css( "background-color", "#8FA7AB" );
            break;
        case "a11" :
            modalImg.attr( "src", "media/B11.png" );
            modal.css( "background-color", "#70A473" );
            break;
        case "a12" :
            modalImg.attr( "src", "media/B12.png" );
            modal.css( "background-color", "#915070" );
            break;
        default:
            break;
    }
};


function validateEmail( email ) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
};
