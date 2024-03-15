import amqp from 'amqplib';

const exchangeConfig = {title: 'system_exchange', type: 'direct'};
const queues = ['system_info', 'system_errors', 'system_success'];
const logs = [
    {
        type: 'logs.system.info',
        message: 'system info'
    },
    {
        type: 'logs.system.error',
        message: 'system error'
    },
    {
        type: 'logs.system.success',
        message: 'system success'
    }
];

async function exchange() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672,
        username: 'rabbitmq',
        password: 'rabbitmq'
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

    await channel.bindQueue(queues[0], exchangeConfig.title, 'logs.#');
    await channel.bindQueue(queues[1], exchangeConfig.title, '#.error');
    await channel.bindQueue(queues[2], exchangeConfig.title, '#.success');

    // Publicar mensagem com chave de roteamento
    //channel.publish(`${exchanges[0]}`, `${logs[0].type}`, Buffer.from(`${logs[0].message}`));
    channel.publish(`${exchangeConfig.title}`, `${logs[1].type}`, Buffer.from(`${logs[1].message}`));
    channel.publish(`${exchangeConfig.title}`, `${logs[2].type}`, Buffer.from(`${logs[2].message}`));

    await channel.close();
    await connection.close();

};

exchange();