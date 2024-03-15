import amqp from 'amqplib';

async function message() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
    });

    const channel = await connection.createChannel();

    await channel.assertQueue('max_length', {
        maxLength: 400
    });

    channel.publish('', 'max_length', Buffer.from(`max_length message`));

    await channel.close();
    await connection.close();

};

message();