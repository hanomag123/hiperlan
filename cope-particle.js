! function () {
  let t = document.getElementById("canvas");
  if (!t) return;
  let i = t.getContext("2d"),
    e = t.width = innerWidth,
    l = t.height = innerHeight,
    o = [],
    c = {};

  function r() {
    c = {
      bgColor: "#FFFFFF",
      particleColor: "#B9E7FF",
      particleRadius: e < 1024 ? 5 : .3 * (e / 100),
      particleCount: e < 1024 ? 50 : 100,
      particleMaxVelocity: e < 1024 ?  .4 : .025 * (e / 100),
      lineLength: e < 1024 ? 100 : 10 * (e / 100),
      particleLife: 10,
      colorline: "rgba(185, 231, 255, "
    }
  }
  r(), window.onresize = function () {
    e = t.width = innerWidth, l = t.height = innerHeight, o = [], r(), s()
  };
  class a {
    constructor() {
      this.r = c.particleRadius, this.x = Math.random() * e, this.y = Math.random() * l, this.velocityX = Math.random() * (2 * c.particleMaxVelocity) - c.particleMaxVelocity, this.velocityY = Math.random() * (2 * c.particleMaxVelocity) - c.particleMaxVelocity, this.life = Math.random() * c.particleLife * 60
    }
    position() {
      this.x + this.velocityX + this.r > e && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX, this.y + this.velocityY + this.r > l && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY, this.x += this.velocityX, this.y += this.velocityY
    }
    reDraw() {
      i.beginPath(), i.arc(this.x, this.y, c.particleRadius, 0, 2 * Math.PI), i.closePath(), i.fillStyle = c.particleColor, i.fill()
    }
    reCalculateLife() {
      this.life < 1 && (this.x = Math.random() * e, this.y = Math.random() * l, this.velocityX = Math.random() * (2 * c.particleMaxVelocity) - c.particleMaxVelocity, this.velocityY = Math.random() * (2 * c.particleMaxVelocity) - c.particleMaxVelocity, this.life = Math.random() * c.particleLife * 60), this.life--
    }
  }

  function s() {
    for (let t = 0; t < c.particleCount; t++) o.push(new a);
    ! function t() {
      i.fillStyle = c.bgColor, i.fillRect(0, 0, e, l),
        function t() {
          for (let i of o) i.position(), i.reDraw()
        }(),
        function t() {
          let e, l, r, a, s, h;
          for (let n in o)
            for (let y in o) e = o[n].x, l = o[n].y, (s = Math.sqrt(Math.pow((r = o[y].x) - e, 2) + Math.pow((a = o[y].y) - l, 2))) < c.lineLength && (h = 1 - s / c.lineLength, i.lineWidth = "0,5", i.strokeStyle = c.colorline + h + ")", i.beginPath(), i.moveTo(e, l), i.lineTo(r, a), i.closePath(), i.stroke())
        }(), requestAnimationFrame(t)
    }()
  }
  s()
}();