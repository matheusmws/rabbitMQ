import amqp from 'amqplib';

async function message() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
    });

    const channel = await connection.createChannel();

    await channel.assertQueue('message_ttl', {
        messageTtl: 30000
    });

    channel.publish('', 'message_ttl', Buffer.from(`message_ttl message`));

    await channel.close();
    await connection.close();

};

message();