var p1,p2
var ball
var score1 = 0;
var score2 = 0
function setup() {
  squareCanvas()
  p1 = new Paddle(0)
  p2 = new Paddle(1)
  ball = new Ball();
}

function draw() {
  background(0);
  p1.update();
  p1.draw();
  p2.update();
  p2.draw();
  ball.update();
  ball.draw();
  textSize(20)
  text(score2,30,40)
  text(score1,width-30,40)
}

class Ball
{
  constructor()
  {
    this.x = width/2;
    this.y = height/2;
    
    var a = random(0,TWO_PI)
    this.speed = 4
    
    this.xVel = cos(a)*this.speed;
    this.yVel = sin(a)*this.speed;
    this.size = 10;
    this.predict = createVector(0,0)
  }
  
  update()
  {
    this.x+=this.xVel;
    this.y+=this.yVel;
    
    var cl1 = p1.collide(this.x,this.y,this.size)
    var cl2=p2.collide(this.x,this.y,this.size)
    if (cl1||cl2)
    {
      
      if (cl1)
      {
        this.xVel=abs(this.xVel)
      }else if (cl2)
      {
        this.xVel=abs(this.xVel)*-1
      }
      
      this.x = constrain(this.x,p1.x+p1.width,p2.x-p2.width)
      var a = getAngle(this.x,this.y,this.x+this.xVel,this.y+this.yVel)
      a+=random(-PI/5,PI/5);
      this.xVel = cos(a)*this.speed
      this.yVel = sin(a)*this.speed/2
      this.speed+=0.5
    }
    
    if (this.y-this.size/2 < 0)
    {
      this.yVel *=-1;
    }
    
    if (this.y+this.size/2 > height)
    {
      this.yVel *=-1
    }
    
    if (this.x < 0)
    {
      score1++;
      this.x = width/2;
      this.y = height/2;

      var a = random(0,TWO_PI)
      this.speed = 4

      this.xVel = cos(a)*this.speed;
      this.yVel = sin(a)*this.speed/2;
    }
    if (this.x > width)
    {
      score2++;
      this.x = width/2;
      this.y = height/2;

      var a = random(0,TWO_PI)
      this.speed = 4

      this.xVel = cos(a)*this.speed;
      this.yVel = sin(a)*this.speed/2;
    }
    
    this.predict = calc(this.x,this.y,this.xVel,this.yVel)
    
    
  }
  
  draw()
  {
    circle(this.x,this.y,this.size)
    push();
    fill('red')
    
    
    //circle(a[0],a[1],50)
    
    pop();
  }
}

class Paddle
{
  constructor(side)
  {
    this.side = side;
    
    this.length = 50;
    this.y = height/2 - this.length/2;
    this.width = 10;
    if (side == 1)
    {
      this.x = width-this.width*2;
    }else
    {
      this.x = this.width
    }
  }
  
  update()
  {
    
    
    ////////////ai
    
    
    var k = ball.predict[1]-this.length/2
    if (this.side == 1 && ball.xVel > 0 && k>this.y)
    {
      this.y+=10
    }
    if (this.side == 0&&ball.xVel < 0 && k>this.y)
    {
      this.y+=10
    }
    if (this.side == 1 && ball.xVel > 0 && k<this.y)
    {
      this.y-=10
    }
    if (this.side == 0&&ball.xVel < 0 && k<this.y)
    {
      this.y-=10
    }
    ////////////
    if (this.side == 1){
      if (keyCodeDown(DOWN_ARROW))
      {
        this.y+=10;
      }
      if (keyCodeDown(UP_ARROW))
      {
        this.y-=10;
      }
    }else
    {
       if (keyCodeDown(83))
      {
        this.y+=10;
      }
      if (keyCodeDown(87))
      {
        this.y-=10;
      } 
    }
    if (collideLineRect(0,height,width,height,this.x,this.y,this.width,this.length))
    {
      this.y = height-this.length-1
      
    }
    
    if (collideLineRect(0,0,width,0,this.x,this.y,this.width,this.length))
    {
      this.y = 1
      
    }
  }
  
  draw()
  {
    stroke(255)
    fill(100)
    rect(this.x,this.y,this.width,this.length)
  }
  
  collide(x,y,size)
  {
    return (collideRectCircle(this.x,this.y,this.width,this.length,x,y,size));
  }
  
}



  function calc(x,y,xVel,yVel,forget=0)
  {
    var n = 0;
   
    var test = intersect(x,y,x+(xVel*999),y+(yVel*999),0,0,width,0)
    var test2 = intersect(x,y,x+xVel*999,y+yVel*999,0,height,width,height)
    
    if (test!=false&&forget!=2)
    {
      
      var a = createVector(xVel,yVel)
      a.reflect(createVector(0,10))
      return calc(test[0],test[1],a.x,a.y,2)
    }
    if (test2!=false&&forget!=1)
    {
      
      var a = createVector(xVel,yVel)
      a.reflect(createVector(0,-10))
      return calc(test2[0],test2[1],a.x,a.y,1)
    }
    
    test = intersect(x,y,x+(xVel*999),y+(yVel*999),0,0,0,height)
    test2 = intersect(x,y,x+xVel*999,y+yVel*999,width,0,width,height)
    
    if (test!=false)
    {
      return test;
    }
    if (test2!=false)
    {
      return test2;
    }
    
    
  }


