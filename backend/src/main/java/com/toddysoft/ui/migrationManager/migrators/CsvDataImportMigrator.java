package com.toddysoft.ui.migrationManager.migrators;

import liquibase.util.csv.CSVReader;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Configurable;

import javax.sql.DataSource;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * Imports data from the cvs file specified with the "src" attribute into the table specified by the "table" attribute.
 */
@Configurable
public class CsvDataImportMigrator implements Migrator {

    private static final DateFormat datetimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static final DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static final DateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

    @Override
    public void migrate(Element configuration, String migrationRoot, DataSource dataSource) throws Exception {
        try {
            final Connection connection = dataSource.getConnection();
            final boolean wasAutoCommit = connection.getAutoCommit();
            try {
                connection.setAutoCommit(false);

                final String tableName = configuration.attributeValue("table");
                final String csvFileName = configuration.attributeValue("src");
                final InputStream csvFileInputStream =
                        this.getClass().getClassLoader().getResourceAsStream(csvFileName);
                if(csvFileInputStream != null) {
                    final Reader csvFileReader = new InputStreamReader(csvFileInputStream, StandardCharsets.UTF_8);
                    final CSVReader csvReader = new CSVReader(csvFileReader, ',', '\"');
                    final String[] columnNames = csvReader.readNext();
                    if(columnNames != null) {
                        final StringBuilder query = new StringBuilder();
                        query.append("INSERT INTO ").append(tableName).append(" (");
                        for(int i = 0; i < columnNames.length; i++) {
                            query.append(columnNames[i]);
                            if(i < (columnNames.length - 1)) {
                                query.append(", ");
                            }
                        }
                        query.append(") VALUES (");
                        for(int i = 0; i < columnNames.length; i++) {
                            query.append("?");
                            if(i < (columnNames.length - 1)) {
                                query.append(", ");
                            }
                        }
                        query.append(")");

                        ResultSet columns = null;
                        PreparedStatement stmnt = null;
                        try {
                            // Get the columns metadata.
                            columns = connection.getMetaData().getColumns(
                                    null, null, tableName, null);
                            final Map<String, String> types = new HashMap<String, String>();
                            while (columns.next()) {
                                types.put(columns.getString("COLUMN_NAME").toUpperCase(),
                                        columns.getString("TYPE_NAME").toUpperCase());
                            }

                            // Prepare the statement for inserting data.
                            stmnt = connection.prepareStatement(query.toString());

                            String [] rowData;
                            try {
                                while ((rowData = csvReader.readNext()) != null) {
                                    stmnt.clearParameters();
                                    for(int i = 0; i < rowData.length; i++) {
                                        final String columnTypeName = types.get(columnNames[i]);

                                        String data = rowData[i];
                                        if("NULL".equals(data)) {
                                            data = null;
                                        } else if("\\N".equals(data)) {
                                            data = null;
                                        } else {
                                            data = data.replaceAll("\\\\", "");
                                        }

                                        if(columnTypeName.contains("INT")) {
                                            if(data == null) {
                                                stmnt.setNull(i + 1, Types.INTEGER);
                                            } else {
                                                stmnt.setInt(i + 1, Integer.parseInt(data));
                                            }
                                        } else if(columnTypeName.contains("DOUBLE")) {
                                            if(data == null) {
                                                stmnt.setNull(i + 1, Types.DOUBLE);
                                            } else {
                                                stmnt.setDouble(i + 1, Double.parseDouble(data));
                                            }
                                        } else if(columnTypeName.contains("BIT")) {
                                            stmnt.setBoolean(i + 1, "1".equals(data));
                                        } else if(columnTypeName.equals("DATETIME")) {
                                            Date date = null;
                                            if(data != null) {
                                                try {
                                                    date = new Date(datetimeFormat.parse(data).getTime());
                                                } catch (ParseException e) {
                                                    throw new RuntimeException("Couldn't parse " + data +
                                                            " into a datetime");
                                                }
                                            }
                                            stmnt.setDate(i + 1, date);
                                        } else if(columnTypeName.equals("DATE")) {
                                            Date date = null;
                                            if(data != null) {
                                                try {
                                                    date = new Date(dateFormat.parse(data).getTime());
                                                } catch (ParseException e) {
                                                    throw new RuntimeException("Couldn't parse " + data +
                                                            " into a date");
                                                }
                                            }
                                            stmnt.setDate(i + 1, date);
                                        } else if(columnTypeName.equals("TIME")) {
                                            Date date = null;
                                            if(data != null) {
                                                try {
                                                    date = new Date(timeFormat.parse(data).getTime());
                                                } catch (ParseException e) {
                                                    throw new RuntimeException("Couldn't parse " + data +
                                                            " into a time");
                                                }
                                            }
                                            stmnt.setDate(i + 1, date);
                                        } else {
                                            if(data == null) {
                                                stmnt.setNull(i + 1, Types.VARCHAR);
                                            } else {
                                                stmnt.setString(i + 1, data);
                                            }
                                        }
                                    }
                                    stmnt.execute();
                                }
                                connection.commit();
                            } catch(Exception e) {
                                throw new RuntimeException("Error importing data from " + csvFileName +
                                        " into table " + tableName, e);
                            }
                        } catch(SQLException e) {
                            throw new RuntimeException("Error importing data from " + csvFileName +
                                    " into table " + tableName, e);
                        } finally {
                            if(columns != null) {
                                try {
                                    columns.close();
                                } catch(SQLException e) {
                                    // Ignore.
                                }
                            }
                            if(stmnt != null) {
                                try {
                                    stmnt.close();
                                } catch(SQLException e) {
                                    // Ignore.
                                }
                            }
                        }
                    }
                } else {
                    throw new RuntimeException("Couldn't find data resource " + csvFileName +
                            " for importing data into " + tableName);
                }
            } finally {
                connection.setAutoCommit(wasAutoCommit);
                try {
                    connection.close();
                } catch (Exception e) {
                    // Ignore.
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
