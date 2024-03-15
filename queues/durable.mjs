import amqp from 'amqplib';

async function message() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
    });

    const channel = await connection.createChannel();

    await channel.assertQueue('durable', {
        durable: true
    });

    channel.publish('', 'durable', Buffer.from(`durable message`), { persistent: true });

    await channel.close();
    await connection.close();

};

message();