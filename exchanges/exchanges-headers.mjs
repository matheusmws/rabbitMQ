import amqp from 'amqplib';

const exchangeConfig = { title: 'notify_headers', type: 'headers' };
const queues = [
    {
        title: 'email_notification',
        name: 'email',
        headers: {
            'notification_type': 'email'
        }
    },
    {
        title: 'sms_notification',
        name: 'sms',
        headers: {
            'notification_type': 'sms'
        }
    },
    {
        title: 'push_notification',
        name: 'push',
        headers: {
            'notification_type': 'push'
        }
    }
];

async function exchange() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq',
        vhost: 'header'
    });

    const channel = await connection.createChannel();

    // cria uma exchange
    await channel.assertExchange(exchangeConfig.title, exchangeConfig.type);

    queues.forEach(async queue => {
        //fila que recebe as infos da exchange
        await channel.assertQueue(queue.title, {
            durable: true
        });
    });

    await channel.bindQueue(queues[0].title, exchangeConfig.title, '', queues[0].headers);
    await channel.bindQueue(queues[1].title, exchangeConfig.title, '', queues[1].headers);
    await channel.bindQueue(queues[2].title, exchangeConfig.title, '', queues[2].headers);

    // Publicar mensagem com chave de roteamento
    queues.forEach(queue => {
        channel.publish(`${exchangeConfig.title}`, '', Buffer.from(`headersTo: ${queue.name}`), { headers: queue.headers });
    });

    await channel.close();
    await connection.close();

};

exchange();