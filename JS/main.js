var configuracao = {
    type: Phaser.AUTO, //CANVAS
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var Jogo = new Phaser.Game(configuracao);

var Cursores;
var Jogador;
var plataforma;
var EstaVoltadoParaDireita = false;
var TextoPontuacao;
var TextoTempo;
var Pontuacao = 0;
var MusicaDeFundo;
var Tempo = 10;
var Temporizador = setInterval(Temporizar, 1000);
var JogoEstaFinalizado = false;

function Temporizar() {
    if (Tempo<=0 || JogoEstaFinalizado){
        VerificarDerrota();
        return;
    } 
    
    Tempo--;
    TextoTempo.setText("Tempo: " + Tempo);
}

function preload() {
    this.load.image('ceu', 'ASSETS/BG.png');
    this.load.image('plataformaBase', 'ASSETS/PlataformaChao.png');
    this.load.image('plataformaCeu_1', 'ASSETS/PlataformaCeu_1.png');
    this.load.image('plataformaCeu_2', 'ASSETS/PlataformaCeu_2.png');
    this.load.image('Coletavel', 'ASSETS/Cogumelo.png');

    this.load.audio('MusicaFundo', 'ASSETS/Audios/Komiku_-_03_-_Mushrooms.mp3');
    this.load.spritesheet('Lia_Parada', 'ASSETS/Spritesheet_Lia_Parado.png', { frameWidth: 57, frameHeight: 50 });
    this.load.spritesheet('Lia_Andando', 'ASSETS/Spritesheet_Lia_Andando.png', { frameWidth: 57, frameHeight: 50 });   
}

function create() {

    //#region Instanciação de Objetos
    plataforma = this.physics.add.staticGroup();

    
    this.add.image(400, 300, 'ceu');
    plataforma.create(400, 580, 'plataformaBase');
    Coletaveis = this.physics.add.group();
    
    plataforma.create(186, 467, 'plataformaCeu_1');
    plataforma.create(367, 355, 'plataformaCeu_2');
    plataforma.create(634, 247, 'plataformaCeu_1');
    
    Coletaveis.create(186, 417, 'Coletavel');
    Coletaveis.create(367, 305, 'Coletavel');
    Coletaveis.create(634, 197, 'Coletavel');
    Jogador = this.physics.add.sprite(10, 0, 'Lia_Parada');


    //#endregion

    //#region Animações
    this.anims.create({
        key: 'LiaParada_Esquerda',
        frames: this.anims.generateFrameNumbers('Lia_Parada', {start: 0, end: 9}),
        frameRate: 10
    })
    this.anims.create({
        key: 'LiaParada_Direita',
        frames: this.anims.generateFrameNumbers('Lia_Parada', {start: 10, end: 19}),
        frameRate: 10
    })
    
    this.anims.create({
        key: 'LiaAndando_Esquerda',
        frames: this.anims.generateFrameNumbers('Lia_Andando', {start:0, end: 9}),
        frameRate: 10
    })
    this.anims.create({
        key: 'LiaAndando_Direita',
        frames: this.anims.generateFrameNumbers('Lia_Andando', {start: 10, end: 19}),
        frameRate: 10
    })
    //#endregion
    
    //#region Atribuições de Física

    Jogador.setBounce(0.5);
    Jogador.setCollideWorldBounds(true);
    this.physics.add.collider(Jogador, plataforma);    
    this.physics.add.collider(Coletaveis, plataforma);
    this.physics.add.overlap(Jogador, Coletaveis, pegarColetavel, null, this);

    //#endregion

    Cursores = this.input.keyboard.createCursorKeys();
    
    TextoPontuacao = this.add.text(10,10,"Pontos: 0",{fontStyle: 'bold', fontSize:"32px", fill: "#477A7A"});
    TextoTempo = this.add.text(10,50,"Tempo: " + Tempo,{fontStyle: 'bold', fontSize:"32px", fill: "#477A7A"});
    
    MusicaDeFundo = this.sound.add('MusicaFundo');
    MusicaDeFundo.play();
}


function update() {
  
       Movimentar(Cursores);

}


function pegarColetavel (jogador, coletavel)
{
    if (Tempo <= 0) return;
    
    coletavel.disableBody(true, true);
    Pontuacao += 2;
    TextoPontuacao.setText('Pontos: ' + Pontuacao);
    VerificarEstado_Vitoria();
}

function Movimentar(Cursor) {

    if (JogoEstaFinalizado) 
    {
        Jogador.setVelocityX(0);        
        Jogador.setBounce(0.0);
        DefinirSentidoSprite_Player("LiaParada_Esquerda", "LiaParada_Direita");
        return;
    }
    

    if (Cursor.left.isDown)
    {
        Jogador.setVelocityX(-160);
        EstaVoltadoParaDireita = false;
        DefinirSentidoSprite_Player("LiaAndando_Esquerda", "LiaAndando_Direita");
    }
    else if (Cursor.right.isDown)
    {
        Jogador.setVelocityX(160);
        EstaVoltadoParaDireita = true;
        DefinirSentidoSprite_Player("LiaAndando_Esquerda", "LiaAndando_Direita");
    }
    else
    {
        Jogador.setVelocityX(0);
        DefinirSentidoSprite_Player("LiaParada_Esquerda", "LiaParada_Direita");

    }

    if (Cursor.up.isDown && Jogador.body.touching.down)
    {        
        Jogador.setVelocityY(-330);
    }

}

function DefinirSentidoSprite_Player(AnimacaoSentidoEsquerda, AnimacaoSentidoDireita) {

    if(!EstaVoltadoParaDireita) 
    {
        Jogador.anims.play(AnimacaoSentidoEsquerda, true);
    }
    else
    {
        Jogador.anims.play(AnimacaoSentidoDireita, true);  
    } 

}

function VerificarEstado_Vitoria() {
    if (Pontuacao >= 6) {
        JogoEstaFinalizado = true;
        TextoPontuacao.setText('Vitória!! Você pegou tudo!');
    }

}

function VerificarDerrota() {
    if (Tempo <= 0 && !JogoEstaFinalizado)
    {
        TextoTempo.setText("Você Perdeu");
    }
}
