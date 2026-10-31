"use strict";

document.puzzleApp={
  map:null,
  marker:null,

  init: function () {
    if ("Notification" in window && Notification.permission!=="granted") {
      Notification.requestPermission();
    }
    this.map = L.map("map").setView([53.4468, 14.5534], 16);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    }).addTo(this.map);
    document.getElementById("getLocationBtn").onclick=()=>this.getLocation();
    document.getElementById("saveRasterBtn").onclick=()=>this.createPuzzle();
    this.setupBoard();
  },
  getLocation: function () {
    if (!navigator.geolocation) {
      alert("Brak geolokalizacji w przeglądarce");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        let lat=pos.coords.latitude;
        let lng=pos.coords.longitude;
        document.getElementById("coords").innerText=`(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        this.map.setView([lat,lng],16);
        if (this.marker) {
          this.marker.setLatLng([lat,lng]);
        } else {
          this.marker=L.marker([lat,lng]).addTo(this.map);
        }
      },
      (err)=>{
        console.error(err);
        alert("Nie udało się pobrać współrzędnych");
      }
    );
  },
  setupBoard: function () {
    let board=document.getElementById("targetBoard");
    board.innerHTML="";
    for (let i=0;i<16;i++) {
      let slot=document.createElement("div");
      slot.className="drop-slot";
      slot.dataset.slotIndex=i;
      slot.addEventListener("dragover",(e)=>e.preventDefault());
      slot.addEventListener("drop",(e)=>{
        e.preventDefault();
        let pieceId=e.dataTransfer.getData("text");
        let piece=document.getElementById(pieceId);
        if (slot.children.length===0&&piece) {
          slot.appendChild(piece);
          this.checkWin();
        }
      });
      board.appendChild(slot);
    }
  },
  createPuzzle: function () {
    leafletImage(this.map,(err,canvas)=>{
      if (err) {
        alert("Błąd pobierania mapy");
        return;
      }
      let container=document.getElementById("piecesContainer");
      container.innerHTML="";
      this.setupBoard();
      let pieceW=canvas.width/4;
      let pieceH=canvas.height/4;
      let pieces=[];
      for (let row=0;row<4;row++) {
        for (let col=0;col<4;col++) {
          let index=row*4+col;
          let pCanvas=document.createElement("canvas");
          pCanvas.width=pieceW;
          pCanvas.height=pieceH;
          let ctx=pCanvas.getContext("2d");
          ctx.drawImage(
            canvas,
            col*pieceW,row*pieceH,pieceW,pieceH,
            0,0,pieceW,pieceH
          );
          let img=document.createElement("img");
          img.src=pCanvas.toDataURL();
          img.className="puzzle-piece";
          img.id="piece_"+index;
          img.dataset.correctIndex=index;
          img.draggable=true;
          img.style.width="100%";
          img.style.height="100%";
          img.addEventListener("dragstart",(e)=>{
            e.dataTransfer.setData("text",e.target.id);
          });
          pieces.push(img);
        }
      }
      pieces.sort(()=>Math.random()-0.5);
      for (let piece of pieces) {
        let wrap=document.createElement("div");
        wrap.style.width="225px";
        wrap.style.height="150px";
        wrap.addEventListener("dragover",(e)=>e.preventDefault());
        wrap.addEventListener("drop",(e)=>{
          e.preventDefault();
          let pieceId=e.dataTransfer.getData("text");
          let p=document.getElementById(pieceId);
          if (wrap.children.length===0 && p) {
            wrap.appendChild(p);
            this.checkWin();
          }
        });
        wrap.appendChild(piece);
        container.appendChild(wrap);
      }
    });
  },
  checkWin: function () {
    let slots=document.querySelectorAll("#targetBoard .drop-slot");
    let correct=0;
    slots.forEach((slot)=>{
      let piece=slot.querySelector(".puzzle-piece");
      if (piece && piece.dataset.correctIndex===slot.dataset.slotIndex) {
        correct++;
      }
    });
    console.debug(`Poprawnie ułożone: ${correct}/16`);
    if (correct===16) {
      console.debug("Wszystkie puzzle ułożone poprawnie!");
      if ("Notification" in window && Notification.permission==="granted") {
        new Notification("Gratulacje!", {
          body: "Udało Ci się poprawnie ułożyć mapę!"
        });
      } else {
        alert("Gratulacje! Wszystko ułożone poprawnie!");
      }
    }
  }
};
document.addEventListener("DOMContentLoaded",()=>{
  document.puzzleApp.init();
});
