import { WebThreeModule } from "@modules/web-three/web-three.module";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CertificateController } from "./controllers";
import { CertificateType } from "./entities";
import {
  CertificateTypeService,
  CertificateTypeTrackerService
} from "./services";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CertificateType
    ]),
    forwardRef(() => WebThreeModule)
  ],
  controllers: [
    CertificateController
  ],
  providers: [
    CertificateTypeService,
    CertificateTypeTrackerService
  ],
  exports: [
    CertificateTypeTrackerService
  ],
})
export class CertificateModule { }