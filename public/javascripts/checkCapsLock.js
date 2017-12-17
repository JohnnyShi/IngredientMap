/*
Listen on capslock key when input password
keycode and charcode are deprecated
*/
$("#password, #password_repeat").on({
	focusout:function(event){
		$(this).next().css("visibility", "hidden");
	},
	// keypress can't recognize non-digital or character keys
	keydown:function(event){
		if (event.originalEvent.getModifierState("CapsLock")){
			$(this).next().css("visibility", "visible");
		} else {
			$(this).next().css("visibility", "hidden");
		}
	},
	keyup:function(event){
		if (event.originalEvent.getModifierState("CapsLock")){
			$(this).next().css("visibility", "visible");
		} else {
			$(this).next().css("visibility", "hidden");
		}
	}
});