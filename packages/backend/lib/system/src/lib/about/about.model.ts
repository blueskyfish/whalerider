import { ApiProperty } from "@nestjs/swagger";

export class About {
  @ApiProperty({ description: 'The name of the application'})
  name!: string;
  @ApiProperty({ description: 'The title of the application'})
  title!: string;
  @ApiProperty({ description: 'The version with stage info at the end'})
  version!: string;
  @ApiProperty({ description: 'The description'})
  description!: string;
  @ApiProperty({ description: 'The author'})
  author!: string;
  @ApiProperty({ description: 'The last commit as sha'})
  commit!: string;
  @ApiProperty({ description: 'The date of the commit'})
  commitDate!: string;
  @ApiProperty({ description: 'The git branch'})
  branch!: string;
  @ApiProperty({ description: 'The build date'})
  buildDate!: string;
}
