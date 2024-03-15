import amqp from 'amqplib';

const queues = ['first_queue'];

async function main() {

    //cria conexão do node com o rabbit
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
    });

    //cria um canal para possibilitar a conexão
    const channel = await connection.createChannel();

    //cria uma fila caso não exista
    await channel.assertQueue(queues[0], {
        durable: true //fila persistida
    });

    // Enviando mensagem via publish
    for (let i = 0; i < 1000; i++) {
        channel.publish('', queues[0], Buffer.from(`Minha mensagem ${i}`))
    }

    // //envia mensagem via sendToQueue - direct
    // channel.sendToQueue(queues[0], Buffer.from('first queue message from sendToQueue'));

    await channel.close();
    await connection.close();
}

main();