import { ConfigurableModuleCls, MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";
import { User } from "./users/user.entity";
import { Report } from "./reports/report.entity";
import { APP_PIPE } from "@nestjs/core";
const cookieSession = require("cookie-session");
import { config } from 'dotenv';
config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log(config);
        console.log(process.env.DB_NAME);
            
        return {
          type: "sqlite",
          database: process.env.DB_NAME,
          synchronize: true,
          entities: [User, Report]
        }
      } 
    }),
  //   TypeOrmModule.forRoot({
  //   type: "sqlite",
  //   database: process.env.NODE_ENV === "test"? "test.sqlite" : "db.sqlite",
  //   entities: [User, Report],
  //   synchronize: true // auto migration
  // }),
   UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true // additional properties can pass
      })
    },
    ConfigService
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply( cookieSession({
      keys: ["eedwewwef"]
    }))
      .forRoutes('*');
  }
}
