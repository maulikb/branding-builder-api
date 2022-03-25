import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, CreatePostReqSwaggerDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /***
   * Function to register new post
   */
  @Post()
  @ApiTags('Posts')
  @ApiBody({ type: CreatePostReqSwaggerDto })
  @HttpCode(HttpStatus.OK)
  async registerPost(
    @Body() createPostDto: CreatePostDto,
    @Body('eventName') eventName: string,
  ) {
    return this.postsService.createPost(createPostDto, eventName);
  }

  /***
   * Function to get all posts
   */
  @Get()
  @ApiTags('Posts')
  getAllPoss() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  @ApiTags('Posts')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }
  /***
   * Function to delete post with removing reference in event
   */
  @Delete(':POST_ID')
  @ApiTags('Posts')
  deletePost(@Param('POST_ID') id: string) {
    return this.postsService.deletePost(id);
  }
}
