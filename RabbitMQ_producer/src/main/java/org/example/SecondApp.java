package org.example;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class SecondApp {
    private static final String QUEUE = "ds_2023_queue";
    private static final String EXCHANGE = "ds_2023_exchange";
    private static final String ROUTING_KEY = "ds_2023_routing_key";
    private static final String CSV_FILE_PATH = "RabbitMQ_producer\\sensor.csv";
    private static Integer counter = 5;

    public static void main(String[] args) {
        ConnectionFactory factory = new ConnectionFactory();
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            declareQueue(channel);
            readCsvAndPublishMessages(channel);
        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    private static void declareQueue(Channel channel) throws IOException {
        channel.exchangeDeclare(EXCHANGE, BuiltinExchangeType.DIRECT, true);
        channel.queueDeclare(QUEUE, true, false, false, null);
        channel.queueBind(QUEUE, EXCHANGE, ROUTING_KEY);
    }

    private static void readCsvAndPublishMessages(Channel channel) {
        try (BufferedReader br = new BufferedReader(new FileReader(CSV_FILE_PATH))) {
            String line;
            while ((line = br.readLine()) != null) {
                double measurementValue = Double.parseDouble(line);
                String jsonMessage = createJsonMessage(measurementValue);

                channel.basicPublish(EXCHANGE, ROUTING_KEY, null, jsonMessage.getBytes());
                System.out.println(" [x] Sent: " + jsonMessage);

                Thread.sleep(500);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static String createJsonMessage(double measurementValue) {
        String timestamp = String.valueOf(System.currentTimeMillis() + (10L * 60 * 1000 * counter));
        Long deviceId = 2L;
        counter++;

        JsonObject json = new JsonObject();
        json.addProperty("timestamp", timestamp);
        json.addProperty("device_id", deviceId);
        json.addProperty("measurement_value", measurementValue);

        return new Gson().toJson(json);
    }
}
