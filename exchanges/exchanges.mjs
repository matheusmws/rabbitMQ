import amqp from 'amqplib';

const exchangeConfig = {title: 'first_exchange', type: 'direct'};
const queues = ['notifications', 'emails'];
const key = `${exchangeConfig.title}_${queues[0]}`;
const message = `message to queues: ${queues.join()}`;

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

    queues.forEach(async (queue) => {
        //fila que recebe as infos da exchange
        await channel.assertQueue(queue, {
            durable: true
        });
    });

    // Binding - linkar fila a exchange
    await channel.bindQueue(queues[0], exchangeConfig.title, `${key}`);
    await channel.bindQueue(queues[1], exchangeConfig.title, `${key}`);

    // Publicar mensagem com chave de roteamento
    channel.publish(
        `${exchangeConfig.title}`,
        `${key}`,
        Buffer.from(`${message}`)
    )

    await channel.close();
    await connection.close();

};

exchange();