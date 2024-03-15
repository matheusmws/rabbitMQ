import amqp from "amqplib";

const queues = ['first_queue'];

async function main() {
    const conn = await amqp.connect({
        hostname: "localhost",
        port: 5672,
        username: "rabbitmq",
        password: "rabbitmq",
    });

    const channel = await conn.createChannel();

    await channel.assertQueue(queues[0], {
        durable: true
    })

    //limita a quantidade de mensagens que serão lidas
    channel.prefetch(100);

    await channel.consume(queues[0], (data) => {
        console.log(data.content.toString()); //mensagem

        //remove mensagem da fila
        setTimeout(() => { channel.ack(data) }, 5000);
    });
}

main();