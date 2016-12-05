'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, LivingStatue, Combat, EventParser, CoC, EngineCore ) {
	function LivingStatueScenes() {
	}

	LivingStatueScenes.prototype.encounter = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'The immense statue gives a mighty groan as you near and shudders, shaking loose years of dust and grime. A few ravens cry in distress as they\'re shaken loose from their roosts. Taking a step back, you watch as the mammoth figure pushes itself up to a standing position. It towers above, at least thirty feet tall, and easily lifts a hammer carved from the same marble as its gleaming muscles.' );
		if( EngineCore.silly() ) {
			EngineCore.outputText( ' On the plus side, it seems to lack knees. That should make dodging its attacks a bit easier.' );
		}
		EngineCore.outputText( 'Moss clings to its chin an age-gifted beard. Bits of it shake loose as it speaks. <i>"Tresspasser!"</i>' );
		EngineCore.outputText( '\n\nStriding towards you, the behemoth raises its hammer overhead. Dust cascades from its seamless joints, and it\'s only as it closes distance that you spot a pockmarks and near-invisible surface cracks, the hallmarks of its age. You\'ll have to fight this alabaster destroyer if you want to live!' );
		Combat.startCombat( new LivingStatue() );
	};
	LivingStatueScenes.prototype.beatUpDaStatue = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Cracks spiderweb out from the point of your last strike, spreading like wildfire across the surface of the stone giant. It groans in pain as its face slowly freezes, locked in a grimace of inhuman suffering before the whole of it comes apart. Chunks of marble fall, kicking up a cloud of white dust and dirt. When it clears, there\'s nothing left but two marble feet, amputated at the ankle, standing amidst a field of rubble.' );
		EngineCore.outputText( '\n\nA gleaming, purple stone in the center catches your eye.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Take Stone', this.takeTheStone );
	};
	LivingStatueScenes.prototype.takeTheStone = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You carefully step through the cratered rubble to claim your prize. It\'s a chunk of lethicite,' );
		// 9999 dis shit.;
		if( CoC.player.hasKeyItem( 'Marae\'s Lethicite' ) ) {
			EngineCore.outputText( ' easily as big as Marae\'s.' );
		} else {
			EngineCore.outputText( ' like the purple crystals in the factory, only this one is three times as big.' );
		}
		EngineCore.outputText( '\n\n<b>Lethicite acquired!</b>' );
		CoC.player.createKeyItem( 'Stone Statue Lethicite', 0, 0, 0, 0 );
		Combat.cleanupAfterCombat( SceneLib.d3.resumeFromFight );
	};
	LivingStatueScenes.prototype.fuckinMarbleOP = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You slump to your knees, overwhelmed and unable to see the shadow of the falling hammer. Your last thoughts are of regret.' );
		EngineCore.gameOver();
	};
	SceneLib.registerScene( 'livingStatueScenes', new LivingStatueScenes() );
} );