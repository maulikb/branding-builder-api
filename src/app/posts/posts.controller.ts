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
import {
  CreatePostDto,
  CreatePostReqDto,
  CreatePostReqSwaggerDto,
  CreatePostResSwaggerDto,
} from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonApiResponses } from '../common/decorators/common-swagger.decorator';

@Controller({ path: 'api/', version: '1' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /***
   * Function to register new post
   */
  @Post('register-post')
  @ApiTags('Posts')
  @ApiBody({ type: CreatePostReqSwaggerDto })
  @ApiOperation({ summary: 'Register New Post And Update Event' })
  @ApiResponse({ type: CreatePostResSwaggerDto, status: HttpStatus.OK })
  @CommonApiResponses()
  async registerPost(
    @Body() createPostReqDto: CreatePostReqDto,
    @Body('eventName') eventName: string,
  ) {
    return this.postsService.createPost(createPostReqDto, eventName);
  }

  /***
   * Function to get all posts
   */
  @Get('get-all-posts')
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get All Events' })
  @ApiResponse({ type: CreatePostResSwaggerDto, status: HttpStatus.OK })
  @CommonApiResponses()
  getAllPoss() {
    return this.postsService.findAllPosts();
  }

  /***
   * Function to find post by id
   */
  @Get('get-post-by-id/:ID')
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get Single Post By ID' })
  @ApiResponse({ type: CreatePostResSwaggerDto, status: HttpStatus.OK })
  @CommonApiResponses()
  getPostById(@Param('ID') id: string) {
    return this.postsService.findPostByID(id);
  }

  /***
   * Function to update post
   */
  @Patch('update-post/:ID')
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Update Post' })
  @ApiResponse({ type: CreatePostResSwaggerDto, status: HttpStatus.OK })
  @CommonApiResponses()
  updatePost(@Param('ID') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }
  /***
   * Function to delete post with removing reference in event
   */
  @Delete(':POST_ID')
  @ApiTags('Posts')
  @ApiOperation({ summary: 'Delete Post And Remove Reference In Event' })
  deletePost(@Param('POST_ID') id: string) {
    return this.postsService.deletePost(id);
  }
}
