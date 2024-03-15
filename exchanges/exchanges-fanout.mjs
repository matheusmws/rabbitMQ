import amqp from 'amqplib';
import { randomUUID } from 'crypto';

const exchangeConfig = {title: 'notifications', type: 'fanout'};
const queues = ['email_notification', 'sms_notification', 'push_notification'];

async function exchange() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq',
        vhost: 'fanout-example'
    });

    const channel = await connection.createChannel();

    // cria uma exchange
    await channel.assertExchange(exchangeConfig.title, exchangeConfig.type);

    queues.forEach(async queue => {
        //fila que recebe as infos da exchange
        await channel.assertQueue(queue, {
            durable: true
        });
    });

    await channel.bindQueue(queues[0], exchangeConfig.title, '');
    await channel.bindQueue(queues[1], exchangeConfig.title, '');
    await channel.bindQueue(queues[2], exchangeConfig.title, '');

    // Publicar mensagem com chave de roteamento
    channel.publish(`${exchangeConfig.title}`, '', Buffer.from(`Sua conta teve uma atividade suspeita. ID: ${randomUUID()}`));

    await channel.close();
    await connection.close();

};

exchange();