/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

const restify = require('restify');
const builder = require('botbuilder');
const nodeoutlook = require('nodejs-nodemailer-outlook')
//var botbuilder_azure = require("botbuilder-azure");

const rn = require('random-number');
const gen = rn.generator({
  min:  10000
, max:  99999
, integer: true
})

let numero_ticket = function(){ return gen(500)} ;
 // example outputs → 735



// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    //openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

//var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
//var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
const bot = new builder.UniversalBot(connector);
//bot.set('storage', tableStorage);



let datos_usuario = {nombre:'', sip:''};

bot.dialog('/', [
    function (session) {

        
    

        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Hola soy Arcorito")
            .text("Tu asistente virtual.")
            .images([
                 builder.CardImage.create(session, "http://imagizer.imageshack.us/a/img923/2918/22q2kH.png")
            ]);
        //var msg = new builder.Message(session).attachments([card]);
        //session.send(msg);

       // console.log(session.message.user.name);
       // console.log(session.message.user.id);
       // console.log(session.userData);
       var siplargo = session.message.user.id;
       var sipcorto = siplargo.slice(4); 

       datos_usuario.nombre = session.message.user.name;
       datos_usuario.sip = sipcorto;
       
        session.send("En que te puedo ayudar hoy %s .", session.message.user.name);
        session.send("Tu correo electronico es: %s ." , sipcorto);
        //session.send("Hi... I'm the Microsoft Bot Framework demo bot for Skype. I can show you everything you can use our Bot Builder SDK to do on Skype.");
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    }
]);

bot.dialog('/menu', [
    function (session) {
        //builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)");
        builder.Prompts.choice(session, "Con que te puedo ayudar hoy?", "Problemas con Office?|Problemas con el Correo?|Problemas de impresión?|Su computadora no sirve?|Recibir Correo Electronico.|(Salir)", { listStyle: 4 });
    },
    function (session, results) {
        if (results.response && results.response.entity != '(Salir)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog("Ok.. Nos vemos más tarde!");
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });


bot.dialog('/Problemas con Office?', [
    function (session, results) {
        //builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)" );
        builder.Prompts.choice(session, "Indicame con que tenes problemas.", "Microsoft Excel?|Microsoft Word?|Microsoft Power Point?|(Salir)", { listStyle: 4 } );
        
    },
  
    function (session, results) {
        session.beginDialog('/' + results.response.entity);
    }
    
    
]);

bot.dialog('/Microsoft Excel?', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);

bot.dialog('/Microsoft Word?', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);

bot.dialog('/Microsoft Power Point?', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);


/* Dialogo para recir correo, solo testing */
bot.dialog('/Recibir Correo Electronico.', [
    function (session) {

        
        let json_mail = {
            auth: {
                user: "test.1@smartqube.com.ar",
                pass: "Passw0rd"
            }, 
            from: 'Bot Arcorito <test.1@smartqube.com.ar>',
            to: '',
            subject: 'Hey you, awesome!',
            html: ''
        };

       
        json_mail.to=datos_usuario.sip; 
        json_mail.html="hola "+datos_usuario.nombre+"";
        

        nodeoutlook.sendEmail(json_mail);



        session.send("Email Enviado "+JSON.stringify(json_mail)+"");
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);

/* fin recibir correo */


/* Opciones  problemas de correo */

bot.dialog('/Problemas con el Correo?', [
    function (session, results) {
                builder.Prompts.choice(session, "Indicame con que tenes problemas.", "No puedo enviar correos|Outlook no coectal al servidor|(Salir)", { listStyle: 4 } );
    },
  
    function (session, results) {
        session.beginDialog('/' + results.response.entity);
    }
    
    
]);

bot.dialog('/No puedo enviar correos', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);

bot.dialog('/Outlook no coectal al servidor', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);


/* Opciones  problemas de impresion */

bot.dialog('/Problemas de impresión?', [
    function (session, results) {
                builder.Prompts.choice(session, "Indicame con que tenes problemas.", "No encuentro mi impresora|La impresora no imprime|(Salir)", { listStyle: 4 } );
    },
  
    function (session, results) {
        session.beginDialog('/' + results.response.entity);
    }
    
    
]);

bot.dialog('/No encuentro mi impresora', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);

bot.dialog('/La impresora no imprime', [
    function (session) {
        session.send("Su ticket fue  registrador con el Nro '%s', un especialista de mesa de ayuda lo contactara", numero_ticket);
        builder.Prompts.choice(session, "Te podemos ayudar con algo mas?.", "Si|No", { listStyle: 4 });
    },
    function (session, results) {
        //session.send("You chose '%s'", results.response.entity);
        session.beginDialog('/' + results.response.entity);
        //session.send("Usted dijo: '%s'", results.response);
    }

]);

bot.dialog('/Si', [
    function (session) {
          session.beginDialog('/menu');
        
    }

]);

bot.dialog('/No', [
    function (session) {
        session.endDialog("Ok.. Nos vemos más tarde!!");
     }

]);


bot.dialog('/picture', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
    }
]);

bot.dialog('/cards', [
    function (session) {
        session.send("You can use Hero & Thumbnail cards to send the user visually rich information...");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.send(msg);

        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.VideoCard(session)
                    .title("Video Card")
                    .subtitle("Microsoft Band")
                    .text("This is Microsoft Band. For people who want to live healthier and achieve more there is Microsoft Band. Reach your health and fitness goals by tracking your heart rate, exercise, calorie burn, and sleep quality, and be productive with email, text, and calendar alerts on your wrist.")
                    .image(builder.CardImage.create(session, "https://tse1.mm.bing.net/th?id=OVP.Vffb32d4de3ecaecb56e16cadca8398bb&w=150&h=84&c=7&rs=1&pid=2.1"))
                    .media([
                        builder.CardMedia.create(session, "http://video.ch9.ms/ch9/08e5/6a4338c7-8492-4688-998b-43e164d908e5/thenewmicrosoftband2_mid.mp4")
                    ])
                    .autoloop(true)
                    .autostart(false)
                    .shareable(true)                    
            ]);
        session.send(msg);  

        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Thumbnail Card")
                    .subtitle("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market"))
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/list', [
    function (session) {
        session.send("You can send the user a list of cards as multiple attachments in a single message...");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ]),
                new builder.ThumbnailCard(session)
                    .title("Thumbnail Card")
                    .subtitle("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    ])
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/carousel', [
    function (session) {
        session.send("You can pass a custom message to Prompts.choice() that will present the user with a carousel of cards to select from. Each card can even support multiple actions.");
        
        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                            .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:100", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                            .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:101", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("EMP Museum")
                    .text("<b>EMP Musem</b> is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
                            .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:102", "Select")
                    ])
            ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
    },
    function (session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');
        switch (kvPair[0]) {
            case 'select':
                action = 'selected';
                break;
        }
        switch (kvPair[1]) {
            case '100':
                item = "the <b>Space Needle</b>";
                break;
            case '101':
                item = "<b>Pikes Place Market</b>";
                break;
            case '102':
                item = "the <b>EMP Museum</b>";
                break;
        }
        session.endDialog('You %s "%s"', action, item);
    }    
]);

bot.dialog('/receipt', [
    function (session) {
        session.send("You can send a receipts for purchased good with both images and without...");
        
        // Send a receipt with images
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg")),
                        builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method"),
                        builder.Fact.create(session, "WILLCALL", "Delivery Method")
                    ])
                    .tax("$4.40")
                    .total("$48.40")
            ]);
        session.send(msg);

        // Send a receipt without images
        msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        builder.ReceiptItem.create(session, "$22.00", "EMP Museum"),
                        builder.ReceiptItem.create(session, "$22.00", "Space Needle")
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method"),
                        builder.Fact.create(session, "WILLCALL", "Delivery Method")
                    ])
                    .tax("$4.40")
                    .total("$48.40")
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/signin', [ 
    function (session) { 
        // Send a signin 
        var msg = new builder.Message(session) 
            .attachments([ 
                new builder.SigninCard(session) 
                    .text("You must first signin to your account.") 
                    .button("signin", "http://example.com/") 
            ]); 
        session.endDialog(msg); 
    } 
]); 


bot.dialog('/actions', [
    function (session) { 
        session.send("Bots can register global actions, like the 'help' & 'goodbye' actions, that can respond to user input at any time. You can even bind actions to buttons on a card.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .buttons([
                        builder.CardAction.dialogAction(session, "weather", "Seattle, WA", "Current Weather")
                    ])
            ]);
        session.send(msg);

        session.endDialog("The 'Current Weather' button on the card above can be pressed at any time regardless of where the user is in the conversation with the bot. The bot can even show the weather after the conversation has ended.");
    }
]);

// Create a dialog and bind it to a global action
bot.dialog('/weather', [
    function (session, args) {
        session.endDialog("The weather in %s is 71 degrees and raining.", args.data);
    }
]);
bot.beginDialogAction('weather', '/weather');   // <-- no 'matches' option means this can only be triggered by a button.