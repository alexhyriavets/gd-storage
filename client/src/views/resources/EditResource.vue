<template>
  <div>
    <div style="display: flex; align-items: center;">
      <el-button round @click="$router.back()"
        ><i class="el-icon-back"
      /></el-button>
      <h1 style="margin: 0 auto;">
        Edit Resource
      </h1>
    </div>
    <hr />
    <el-card style="width: 400px;  margin: 0 auto; margin-top: 20px;">
      <ResourceForm v-if="resourceToEdit" :resource="resourceToEdit" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ResourceForm } from '@/components/sections/resources/ResourceForm'
import { Action, Getter } from 'vuex-class'
import { ResourcesService } from '@/services/ApiServices'

@Component({
  components: {
    ResourceForm,
  },
})
export default class EditResourceView extends Vue {
  resource: any = null

  get resourceToEdit() {
    if (!this.resource) return

    const {
      deletePermissions,
      description,
      editPermissions,
      file,
      name,
      owner,
      readPermissions,
      _id,
    } = this.resource

    return {
      deletePermissions,
      description,
      editPermissions,
      file: file._id,
      name,
      owner: owner._id,
      readPermissions,
      _id,
    }
  }

  async created() {
    const id = this.$route.params.id

    this.resource = await ResourcesService.fetchResourceById(id)
  }
}
</script>

