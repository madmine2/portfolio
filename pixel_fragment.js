window.addEventListener('load',function(){
    const canvas = document.getElementById('canv1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth/1.5;
    canvas.height = window.innerHeight/1.5;

    class Particle{
        constructor(effect,x,y,color){
            this.effect = effect
            this.size = this.effect.gap;
            this.vx = 0;
            this.vy = 0;
            this.color = color;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            //this.x = Math.floor(x);
            this.x = 0;
            this.y = 0;
            this.ease = 0.03;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
            this.friction = 0.98;
        }
        draw(context){
            context.fillStyle = this.color;
            context.fillRect(this.x,this.y, this.size, this.size);            
        }
        update(){
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;
            
            if(this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy,this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }
            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
            //ça revient à faire 
            //this.vx = this.vx*this.friction;
            //this.x += this.vx + (this.originX - this.x) * this.ease;
        }
    }
    class Effect{
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.particleArray = [];
            this.image = document.getElementById('image1');
            this.centerX = width * 0.5;
            this.centerY = height * 0.5
            this.x = this.centerX - this.image.width*0.5;
            this.y = this.centerY - this.image.height*0.5;
            this.gap = 5;
            this.mouse = {
                radius : 2000,
                x : undefined,
                y : undefined
            }
            window.addEventListener('mousemove',event =>{
                let rect = event.target.getBoundingClientRect();
                this.mouse.x = event.x - rect.left;
                this.mouse.y = event.y - rect.top;
            })
        }
        init(context){
            context.drawImage(this.image,this.x,this.y);
            const pixels = context.getImageData(0,0,this.width,this.height).data;
            for (let y = 0; y < this.height; y += this.gap){
                for(let x = 0; x < this.width ; x += this.gap){
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index+1];
                    const blue = pixels[index+2];
                    const opacity = pixels[index+3];
                    const color = 'rgb('+red+','+green+','+blue+')';

                    if (opacity > 0){
                        this.particleArray.push(new Particle(this, x , y, color));
                    }
                }
            }
           // this.particleArray.push(new Particle(this));    
        }
        draw(context){
            this.particleArray.forEach(particle => particle.draw(context));
        }
        update(){
            this.particleArray.forEach(particle => particle.update());
        }
    }

    const effect1 = new Effect(canvas.width,canvas.height);
    effect1.init(ctx);

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        effect1.draw(ctx);
        effect1.update()
        requestAnimationFrame(animate);
    }
    animate()
})