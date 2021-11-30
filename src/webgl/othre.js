// 剪裁	//
function setScissorTest(scissorTest) {
	  if (scissorTest) {
	    enable(gl.SCISSOR_TEST);
	  } else {
	    disable(gl.SCISSOR_TEST);
	  }
}

// gl.scissor
