import { ErrorBody } from '@blueskyfish/backend-commons';
import { Controller, Get } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { About } from "./about.model";
import { AboutService } from "./about.service";

@ApiTags('System')
@Controller('about')
export class AboutController {

  constructor(private aboutService: AboutService) {
  }

  @ApiOperation({
    description: 'Get the about information from backend application',
    operationId: 'getAbout'
  })
  @ApiOkResponse({
    description: 'The about information',
    type: About
  })
  @ApiNotFoundResponse({
    description: 'About information not found',
    type: ErrorBody
  })
  @Get()
  getAbout(): About {
    return this.aboutService.getAbout();
  }
}
