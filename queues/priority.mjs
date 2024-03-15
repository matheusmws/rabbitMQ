import amqp from 'amqplib';

async function message() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
    });

    const channel = await connection.createChannel();

    await channel.assertQueue('priority', {
        maxPriority: 5
    });

    channel.publish('', 'priority', Buffer.from(`priority message`), { priority: 1 });

    await channel.close();
    await connection.close();

};

message();