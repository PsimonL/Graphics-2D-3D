function start() {
	const canvas = document.getElementById("my_canvas");
	//Inicialize the GL contex
	const gl = canvas.getContext("webgl2");
	if (gl === null) 
	{
	  alert("Unable to initialize WebGL. Your browser or machine may not support it.");
	  return;
	}
  
	console.log("WebGL version: " + gl.getParameter(gl.VERSION));
	console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	console.log("Vendor: " + gl.getParameter(gl.VENDOR));
  
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
  
	const vs = gl.createShader(gl.VERTEX_SHADER);
	const fs = gl.createShader(gl.FRAGMENT_SHADER);
	const program = gl.createProgram();
   
	const vsSource = 
		
		`#version 300 es
			  precision highp float;
			  in vec3 position;
			  in vec3 color;
				  uniform mat4 model;
				  uniform mat4 view;
				  uniform mat4 proj;
				  out vec3 Color;
			  void main(void)
			  {
				  Color = color;
				  gl_Position = proj * view * model * vec4(position,1.0);
			  }`;
  
	const fsSource = 
		
		`#version 300 es
			 precision highp float;
			 in vec3 Color;
  			 out vec4 frag_color;
  			 void main(void)
			{
				frag_color = vec4(Color,1.0);
  
		  	}
		  `;
  
   
	//compilation vs
	gl.shaderSource(vs, vsSource);
	gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) 
	{
	  alert(gl.getShaderInfoLog(vs));
	}
  
	//compilation fs
	gl.shaderSource(fs, fsSource);
	gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) 
	{
	  alert(gl.getShaderInfoLog(fs));
	}
  
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) 
	{
	  alert(gl.getShaderInfoLog(fs));
	}
  
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
  
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) 
	{
	  alert(gl.getProgramInfoLog(program));
	}
  
	gl.useProgram(program); 
	const vertices = 
	[
		-0.5, -0.5, -0.5,  0.0, 0.0, 0.0,
		0.5, -0.5, -0.5,  0.0, 0.0, 1.0,
		0.5,  0.5, -0.5,  0.0, 1.0, 1.0,
		0.5,  0.5, -0.5,  0.0, 1.0, 1.0,
		-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
		-0.5, -0.5, -0.5,  0.0, 0.0, 0.0,
		-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
		0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
		0.5,  0.5,  0.5,  1.0, 1.0, 1.0,
		0.5,  0.5,  0.5,  1.0, 1.0, 1.0,
		-0.5,  0.5,  0.5,  0.0, 1.0, 0.0,
		-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
		-0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
		-0.5,  0.5, -0.5,  1.0, 1.0, 1.0,
		-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
		-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
		-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
		-0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
		0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
		0.5,  0.5, -0.5,  1.0, 1.0, 1.0,
		0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
		0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
		0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
		0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
		-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
		0.5, -0.5, -0.5,  1.0, 1.0, 1.0,
		0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
		0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
		-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
		-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
		-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
		0.5,  0.5, -0.5,  1.0, 1.0, 1.0,
		0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
		0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
		-0.5,  0.5,  0.5,  0.0, 0.0, 0.0,
		-0.5,  0.5, -0.5,  0.0, 1.0, 0.0
	];
  
   
  
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	const position = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 6 * 4, 0);
  
	const color = gl.getAttribLocation(program, "color");
	gl.enableVertexAttribArray(color);
	gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
  
	// macierz modelu
	const model = mat4.create();
	let rotate_angle = (25 * Math.PI) / 180;
	mat4.rotate(model, model, rotate_angle, [0, 0, 1]);
	let uniModel = gl.getUniformLocation(program, "model");
	gl.uniformMatrix4fv(uniModel, false, model);
  
	// macierz projekcji
	const proj = mat4.create();
	mat4.perspective(proj, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
	let uniProj = gl.getUniformLocation(program, "proj");
	gl.uniformMatrix4fv(uniProj, false, proj);
  
	// macierz widoku
	const view = mat4.create();
	mat4.lookAt(view, [0, 0, 3], [0, 0, -1], [0, 1, 0]);
	let uniView = gl.getUniformLocation(program, "view");
	gl.uniformMatrix4fv(uniView, false, view);
  
	let cameraPos = glm.vec3(0, 0, 3);
	let cameraFront = glm.vec3(0, 0, -1);
	let cameraUp = glm.vec3(0, 1, 0);
	let rotation = 0.0;
  
	let cameraFront_tmp = glm.vec3(1, 1, 1);

	function draw() {  
		setCamera();
		  gl.clearColor(0, 0, 0, 1);
		  gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
		window.requestAnimationFrame(draw);
	  }
	window.requestAnimationFrame(draw);

	var pressedKey = {};
  
	document.addEventListener("keyup", (e) => {  
	  pressedKey[e.keyCode] = false;
	  console.log(pressedKey);
	});
  
	document.addEventListener("keydown", (e) => {
	  pressedKey[e.keyCode] = true;
	  console.log(pressedKey);
	});
  
	console.log("setcamera above");

	function setCamera() {
	  let cameraSpeed = 0.02;
	  if (pressedKey["38"] === true) {
		// up
		cameraPos.x += cameraSpeed * cameraFront.x;
		cameraPos.y += cameraSpeed * cameraFront.y;
		cameraPos.z += cameraSpeed * cameraFront.z;
	  } else if (pressedKey["37"] === true) {
		// left
		rotation -= cameraSpeed;
		cameraFront.x = Math.sin(rotation);
		cameraFront.z = -Math.cos(rotation);
	  } else if (pressedKey["39"] === true) {
		// right
		rotation += cameraSpeed;
		cameraFront.x = Math.sin(rotation);
		cameraFront.z = -Math.cos(rotation);
	  } else if (pressedKey["40"] === true) {
		// down
		cameraPos.x -= cameraSpeed * cameraFront.x;
		cameraPos.y -= cameraSpeed * cameraFront.y;
		cameraPos.z -= cameraSpeed * cameraFront.z;
	  } else if (pressedKey["27"] === true) {
		if (confirm("Chcesz opuścić aplikację?")) {
		  close();
		}
	  }
  
	  cameraFront_tmp.x = cameraPos.x + cameraFront.x;
	  cameraFront_tmp.y = cameraPos.y + cameraFront.y;
	  cameraFront_tmp.z = cameraPos.z + cameraFront.z;
	  mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
	  gl.uniformMatrix4fv(uniView, false, view); 
	}


	function kostka() {
		let punkty_ = 36;
		var vertices = [
			-0.5, -0.5, -0.5,  0.0, 0.0, 0.0,
			0.5, -0.5, -0.5,  0.0, 0.0, 1.0,
			0.5,  0.5, -0.5,  0.0, 1.0, 1.0,
			0.5,  0.5, -0.5,  0.0, 1.0, 1.0,
			-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
			-0.5, -0.5, -0.5,  0.0, 0.0, 0.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
			0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 1.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 1.0, 1.0,
			-0.5,  0.5,  0.5,  0.0, 1.0, 0.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
			-0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
			-0.5,  0.5, -0.5,  1.0, 1.0, 1.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
			-0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
			0.5,  0.5, -0.5,  1.0, 1.0, 1.0,
			0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
			0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
			0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
			0.5, -0.5, -0.5,  1.0, 1.0, 1.0,
			0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
			0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
			-0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
			0.5,  0.5, -0.5,  1.0, 1.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
			-0.5,  0.5,  0.5,  0.0, 0.0, 0.0,
			-0.5,  0.5, -0.5,  0.0, 1.0, 0.0
		];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			n_draw=punkty_;
		}
  }