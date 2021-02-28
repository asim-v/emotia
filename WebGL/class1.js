var vertexShaderText = 
[
'precision mediump float',
'',
'attribute fl'
].join('\n')

function initDemo(){
	console.log('LoadingDemo')
	var canvas = document.getElementById('gameSurface');
	var gl = canvas.getContext('webgl')

	if (!gl){
		console.log('WGL not supported');
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl){
		alert('Your browser ded');
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerWidth;
	// gl.viewport(0,0,window.innerWidth,window.innerHeight);	
	gl.clearColor(0.75,0.85,0.8,1);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPHT_BUFFER_BIT)


	// Graphic apps have multiple buffers like the color and the dephht buffer
	// Color: The actual color of the Graphic
	// Depht: The order of elements organized
		// So it asigns values and if some other object tries to draw but a value is set, then ignores the second

	// Now we need the graphic pipeline in order for this to work! (GL Shader Language)
		// Vertex Shader 
			// Input parameters: attributes
			// Outputs: varying
		// Fragment Shader

}