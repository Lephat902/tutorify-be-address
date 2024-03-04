import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { District, Province, Ward } from './entities';
import { readFile } from 'node:fs/promises';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Province, District, Ward]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URI'),
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();

        const getNumOfTablesQuery =
          "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'";
        const result = await dataSource.query(getNumOfTablesQuery);
        const numOfTables = parseInt(result[0].count, 10);

        if (!numOfTables) {
          const createTablesQuery = await readFile(
            './src/address/database/CreateTables_vn_units.sql',
            { encoding: 'utf-8', flag: 'r' },
          );

          await dataSource.query(createTablesQuery);

          const insertDataQuery = await readFile(
            './src/address/database/ImportData_vn_units.sql',
            { encoding: 'utf-8', flag: 'r' },
          );

          await dataSource.query(insertDataQuery);
        }

        return dataSource;
      },
    }),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
