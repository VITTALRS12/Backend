// // utils/kafkaProducer.js
// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'auth-service',
//   brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
// });

// const producer = kafka.producer();

// async function connectProducer() {
//   await producer.connect();
//   console.log('✅ Kafka producer connected');
// }

// connectProducer();

// async function sendEvent(topic, message) {
//   await producer.send({
//     topic,
//     messages: [
//       {
//         value: JSON.stringify(message),
//         timestamp: Date.now().toString(),
//       },
//     ],
//   });
// }

// module.exports = { sendEvent };
