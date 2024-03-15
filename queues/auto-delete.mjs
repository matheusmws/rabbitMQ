import amqp from 'amqplib';

async function message() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
    });

    const channel = await connection.createChannel();

    await channel.assertQueue('auto_delete', {
        autoDelete: true
    });

    channel.publish('', 'auto_delete', Buffer.from(`auto-delete message`));

    await channel.close();
    await connection.close();

};

message();