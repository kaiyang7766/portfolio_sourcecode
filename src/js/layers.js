import TileResolver from './TileResolver.js';

export function createBackgroundLayer (level,tiles, sprites){
	const resolver = new TileResolver(tiles);

	const buffer=document.createElement('canvas');
 	buffer.width=550;
 	buffer.height=640;
 	const context=buffer.getContext('2d');

 	function redraw(startIndex,endIndex){
 		context.clearRect(0,0,buffer.width,buffer.height);
 		for (let x=startIndex;x<=endIndex;++x){
 			const col = tiles.grid[x];
 			if (col){
 				col.forEach((tile,y)=>{
 					if (sprites.animation.has(tile.name)){
 						sprites.drawAnim(tile.name,context,x-startIndex,y,level.totalTime);
 					} else {
 						sprites.drawtile(tile.name,context,x-startIndex,y);
 					}
 				});
 			}
 		}
 	}

 	return function drawBackgroundLayer(context,camera){
 		const drawWidth=resolver.toIndex(camera.size.x);
 		const drawFrom=resolver.toIndex(camera.pos.x);
 		const drawTo=drawFrom+drawWidth;
 		redraw(drawFrom,drawTo);  //+screenwidth here
 		context.drawImage(buffer,
 			-camera.pos.x%16,
 			-camera.pos.y);
 	};
}

export function createSpriteLayer(entities, width=200,height=64){
	const spriteBuffer=document.createElement('canvas');
	spriteBuffer.width=width;
	spriteBuffer.height=height;
	const spriteBufferContext=spriteBuffer.getContext('2d');

	return function drawSpriteLayer(context,camera){
		entities.forEach(entity=>{
			spriteBufferContext.clearRect(0,0,width,height);

			entity.draw(spriteBufferContext);

			context.drawImage(
				spriteBuffer,
				entity.pos.x-camera.pos.x,  //here
				entity.pos.y-camera.pos.y); //here
		});
	};
}

// export function createCollisionLayer(level){
// 	const resolvedTiles=[];

// 	const tileResolver=level.tileCollider.tiles;
// 	const tileSize=tileResolver.tileSize;

// 	const getByIndexOriginal=tileResolver.getByIndex;
// 	tileResolver.getByIndex=function getByIndexFake(x,y){
// 		resolvedTiles.push({x,y});
// 		return getByIndexOriginal.call(tileResolver,x,y);
// 	}

// 	return function drawCollision(context){
// 		context.strokeStyle='blue';
// 		resolvedTiles.forEach(({x,y})=>{
// 			context.beginPath();
// 			context.rect(
// 				x*tileSize-camera.pos.x, //here
// 				y*tileSize-camera.pos.y, //here
// 				tileSize,tileSize);
// 			//context.stroke();
// 			//console.log('Would draw',x,y);
// 		});

// 		context.strokeStyle='red';
// 		level.entities.forEach(entity=>{
// 			context.beginPath();
// 			context.rect(
// 				entity.pos.x-camera.pos.x, //here
// 				entity.pos.y-camera.pos.y, //here
// 				entity.size.x,
// 				entity.size.y);
// 			//context.stroke();
// 		})

// 		resolvedTiles.length=0;
// 	};
// }

export function createCameraLayer(cameraToDraw){
	return function drawCameraRect(context,fromCamera){
		context.strokeStyle='purple';
		context.beginPath();
			context.rect(
				cameraToDraw.pos.x-fromCamera.pos.x,
				cameraToDraw.pos.y-fromCamera.pos.y,
				cameraToDraw.size.x,
				cameraToDraw.size.y);
			context.stroke();
	};
}