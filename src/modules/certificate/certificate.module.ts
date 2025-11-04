import { WebThreeModule } from "@modules/web-three/web-three.module";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThirdPartyModule } from "../third-party/third-party.module";
import { User } from "../user/entities";
import { CertificateController } from "./controllers";
import {
  Certificate,
  CertificateProfile,
  CertificateRequest,
  CertificateType
} from "./entities";
import {
  CertificateService,
  CertificateTrackerService,
  CertificateTypeService,
  CertificateTypeTrackerService
} from "./services";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CertificateType,
      Certificate,
      CertificateProfile,
      CertificateRequest,
      User
    ]),
    forwardRef(() => WebThreeModule),
    ThirdPartyModule
  ],
  controllers: [
    CertificateController
  ],
  providers: [
    CertificateService,
    CertificateTypeService,
    CertificateTypeTrackerService,
    CertificateTrackerService
  ],
  exports: [
    CertificateTypeTrackerService,
    CertificateTrackerService
  ],
})
export class CertificateModule { }