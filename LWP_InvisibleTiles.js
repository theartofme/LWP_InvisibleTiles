//=============================================================================
// LWP_InvisibleTiles.js
//=============================================================================

/*:
 * @target MV MZ
 * @plugindesc Hides tileset/swaps for another tileset. Useful for parallax mapping.
 * @author Logan Pickup
 * 
 * @param blankTileset
 * @text Blank Tileset
 * @desc Which tileset to use for invisible tiles
 * @type file
 * @dir img/tilesets
 * @default blank
 * 
 * @help
 * Allows swapping tileset images when the game is run, so you can use one tileset
 * in the editor and a different one in the actual game. This is useful for parallax
 * mapping, so you can, for example, have tiles with passable/4-dir passable/ladder/
 * etc. made visible in the map editor, but invisible when running the game, allowing
 * you to easily and visually set the boundaries and other properties for parallax-
 * mapped levels.
 * 
 * There are two ways to use this plugin:
 * 
 * 1. Tileset Image Names
 * 
 * If you have a tileset image with "-vis" at the end of its name, for example:
 * 
 * img/tilesets/Dungeon_A1-vis.png
 * 
 * Then when the game runs, it will actually load the version without "-vis", so in
 * the example above it will actually load:
 * 
 * img/tilesets/Dungeon_A1.png
 * 
 * This happens when the game is run, so in the RMMV/RMMZ editor you will still see
 * the "-vis" version of the tiles.
 * 
 * This replacement happens per tileset image, so you can replace some parts of the
 * tileset (e.g. only A2, or only B), or all of it.
 * 
 * 2. Map Notetag
 * 
 * Just put the following in a map's notetag:
 * 
 * invisible tiles
 * 
 * When the map is loaded, all the tileset images will be replaced with 
 * img/tilesets/blank.png by default. If you want to use a different image, you can
 * select one in the plugin parameters; the tileset image in the "Blank Tileset"
 * plugin parameter is the one that will replace the tiles.
 * 
 * This replaces ALL tileset images in the tileset, so if the tileset has A1, A2, B,
 * and C images, all of them will be replaced with the "Blank Tileset" image.
 */

(function() {
	const parameters = PluginManager.parameters('LWP_InvisibleTiles');
	const blankTilesetName = (parameters['blankTileset'] || 'blank').trim()
	let invisibleTiles = false;
	const oldSpriteset_Map_loadTileset = Spriteset_Map.prototype.loadTileset;
	Spriteset_Map.prototype.loadTileset = function() {
		const invisible = ($dataMap.note || "").toLowerCase().contains("invisible tiles");
		if (invisible) {
			invisibleTiles = true;
		}
		oldSpriteset_Map_loadTileset.call(this);
		if (invisible) {
			invisibleTiles = false;
		}
	}
	const oldImageManager_loadTileset = ImageManager.loadTileset;
	ImageManager.loadTileset = function(filename) {
		if (invisibleTiles) {
			return this.loadBitmap("img/tilesets/", blankTilesetName);
		} else if (filename.contains("-vis")) {
			return oldImageManager_loadTileset.call(this, filename.replace("-vis", ""));
		} else {
			return oldImageManager_loadTileset.call(this, filename);
		}
	};

})();
