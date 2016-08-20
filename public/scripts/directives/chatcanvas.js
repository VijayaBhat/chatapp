App.directive('chatCanvas', [function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var $parent   		= element.parent(),
				canvasEle 		= element[0],
				context   		= canvasEle.getContext('2d'),
				leftPerson 		= null,
				rightPerson 	= null,
				msgTemplate     = null,
				personRadius    = 35,
				happyChats      = ["hi", "hmm", "bye", "mng", "Gn8","joy","yoo"];
				radianConvertor = (Math.PI / 180);
			/*
				When ever I start Canvas Work ,I want to check following link.(This link is very usefull for canvas with physics)
				http://chimera.labs.oreilly.com/books/1234000001654/ch02.html#bezier_curves
				RequestAnimationFrame For smooth Animation.
			*/
			window.requestAnimFrame = (function(){
		        return  window.requestAnimationFrame       ||
		          window.webkitRequestAnimationFrame ||
		          window.mozRequestAnimationFrame    ||
		          function( callback ){
		            window.setTimeout(callback, 1000 / 60);
		          };
		    })();

			//initialaize to chat animation
			init();
			
			function init(){
				$parent.css({
					'width' : canvasEle.width + 'px',
					'height': canvasEle.height + 'px',
					'margin': 'auto'
				});

				//Render all Canvas Objects...
				context.fillRect(0,0, canvasEle.width, canvasEle.height);
				context.fill();
				msgTemplate = new messageTemplate(50, 10);
				msgTemplate.render();

				leftPerson = new leftPersonPath(0, 0, personRadius);
				leftPerson.render();
				
				rightPerson = new rightPersonPath(canvasEle.width, 0, personRadius);
				rightPerson.render();

				//Request Animation Frame for smooth animation.
				requestAnimFrame(updateObjects)
			}

			function updateObjects() {
				context.clearRect(0, 0, canvasEle.width, canvasEle.height);
				context.fillStyle = "transparent";
				context.fillRect(0,0, canvasEle.width, canvasEle.height);
				msgTemplate.render();
				leftPerson.render();
				rightPerson.render();

				//updateObjects called recursively called by requestanimationframe.
				requestAnimFrame(updateObjects)
			}

			function leftPersonPath(x,y, radius) {
				this.x = x ;
				this.y = y + radius;
				this.radius = radius;
				this.eye = new eyeObject(this.x + 15, this.y - 5, 8);
				this.mouth = new mouthObject(this.x, this.y + 10, this.radius, 'left');
				this.render = function() {
					/*
						leftPersonPath, rightPersonPath (if you combine both then it's looks like one person)
						I want to make person path like half arc with one eye, mouth..etc
					*/

					context.beginPath();
					context.arc(this.x, this.y, this.radius, radianConvertor * 270, radianConvertor * 90, false);
					context.strokeStyle = 'white';
					context.lineWidth = 3;
					context.moveTo(this.x, this.y + this.radius);
					context.lineTo(this.x + this.radius, this.y + this.radius * 2);
					context.moveTo(this.x, this.y + this.radius);
					context.lineTo(this.x + this.radius, this.y + this.radius);
					context.lineTo(this.x + this.radius , this.y + this.radius * 2);
					context.stroke();
					context.closePath();
					this.eye.render();
					this.mouth.render();
				};
				this.move = function(){

				};
			}

			function rightPersonPath(x,y, radius){
				this.x = x ;
				this.y = y + radius;
				this.radius = radius;
				this.eye = new eyeObject(this.x - radius/2, this.y - 5, 8);
				this.mouth = new mouthObject(this.x, this.y + 10, this.radius, 'right');
				this.render = function() {
					//Person object Path
					context.beginPath();
					context.lineWidth = 3;
					context.arc(this.x, this.y, this.radius, radianConvertor * 270, radianConvertor * 90, true);
					context.strokeStyle = 'white';
					context.moveTo(this.x, this.y + this.radius);
					context.lineTo(this.x - this.radius, this.y + this.radius * 2);
					context.moveTo(this.x, this.y + this.radius);
					context.lineTo(this.x - this.radius, this.y + this.radius);
					context.lineTo(this.x - this.radius , this.y + this.radius * 2);
					context.stroke();
					context.closePath();
					this.eye.render();
					this.mouth.render();
				};
				this.move = function(){

				};
			}

			//Mouth object of person
			function mouthObject(x, y, parentRadius, direction) {
				this.x = x;
				this.y = y;
				this.parentRadius = parentRadius;
				this.direction = direction;
				this.render = function(){
					var xControlPoint = this.direction === 'left' ? (this.x + this.parentRadius) : (this.x - this.parentRadius),
						teethControlPoint = this.direction === 'left' ? (xControlPoint - this.parentRadius) : (xControlPoint + this.parentRadius/2);
						// teethRadius = msgTemplate.direction === this.direction ? 1 : 0;
					    
					context.beginPath();
					context.moveTo(this.x, this.y);
					context.lineWidth = 3;

					context.quadraticCurveTo(xControlPoint,this.y + this.parentRadius/6 ,this.x, this.y + this.parentRadius/3)
					context.strokeStyle = "white";
					context.stroke();
					context.closePath();

					// I want to display teeths of person when sending message , not receving message time.
					if(msgTemplate.direction !== this.direction) {
						context.beginPath();
						context.lineWidth = 1;
						context.arc((teethControlPoint + 8) + Math.random(), (this.y + 4) + Math.random(), 1, radianConvertor * 0, radianConvertor * 360, false);
						context.arc((teethControlPoint + 12) + Math.random(), (this.y + 5) + Math.random(), 1, radianConvertor * 0, radianConvertor * 360, false);
						context.arc(teethControlPoint + (this.direction === "right" ? 16 : 4) + Math.random(), (this.y + 5) + Math.random(), 1, radianConvertor * 0, radianConvertor * 360, false);
						context.stroke();
						context.closePath();

					}
				}
			}

			//Following code executed for Eye object
			function eyeObject(x, y, radius) {
				this.x = x;
				this.y = y;
				this.moveX = x;
				this.radius = radius;
				this.direction = "right";
				this.closeEye = false;
				this.render = function(){
					//Person eye object
					context.beginPath();
					context.lineWidth = 3;

					context.arc(this.x, this.y ,  !this.closeEye ? this.radius : this.radius, radianConvertor * 0, radianConvertor * 360, false);
					context.fillStyle = "white";
					context.fill();
					context.closePath();

					//move control
					context.beginPath();
					context.fillStyle = "black";

					if(this.moveX > this.x + this.radius /2 ) {
						this.direction = "left";
					}  else if(this.moveX <= this.x - this.radius /2){
						this.direction = "right";
						// this.closeEye = true;
					} 
					this.direction === 'right' ? 	(this.moveX = this.moveX + 0.2) : (this.moveX = this.moveX - 0.2);
					context.arc(this.moveX, this.y , 3, radianConvertor * 0, radianConvertor * 360, false);
					context.fill();
					context.closePath();
				}
			}


			function messageTemplate(x, y) {
				this.x = x;
				this.y = y;
				this.currentText = "hai";
				this.direction = "right";

				this.render = function() {
			    	this.gr = createGradientObject(this.x, this.y, this.x + 80, this.y+ 80, 'rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)');

					if(this.x > (canvasEle.width - personRadius - 60/* template width */)) {
						this.direction = "left";
						this.currentText = happyChats[Math.floor(Math.random() * happyChats.length)];
						// this.closeEye = false;
					}  else if(this.x <= personRadius){
						this.direction = "right";
						// this.closeEye = true;
						this.currentText = happyChats[Math.floor(Math.random() * happyChats.length)];
					}
					this.x = this.direction === "right" ? this.x + 2.2 : this.x - 2.2;
					// this.x = this.x - 2.2;
					
					context.beginPath();
					context.lineWidth = 3;
					context.moveTo(this.x, this.y);
					context.quadraticCurveTo(this.x, this.y + 40, this.x - 15, this.y + 50);
					context.quadraticCurveTo(this.x, this.y + 40, this.x + 50, this.y + 40);
					context.quadraticCurveTo(this.x + 90, this.y, this.x, this.y);
					context.strokeStyle = this.gr;
					context.stroke();
					context.closePath();
					context.beginPath();
					context.moveTo(this.x + 5, this.y + 15);
					context.lineTo(this.x + 40, this.y + 15);
					context.stroke();
					context.closePath();
					context.beginPath();
					context.lineWidth =1;
					context.fillStyle = "#ffbbcc";
					context.font = "18px Sans-Serif";
					context.fillText(this.currentText, this.x + 5, this.y + 30 );
					context.closePath();
				}
			}

			function createGradientObject(x, y, width, height, clrPattern1, clrPattern2, clrPattern3) {
				var gr = context.createLinearGradient(x, y, width, height);
			    // Add the color stops.
			    gr.addColorStop(0, clrPattern1);
			    gr.addColorStop(.5, clrPattern2);
			    gr.addColorStop(1, clrPattern1);

			    return gr;
			}
		}
	}
}])