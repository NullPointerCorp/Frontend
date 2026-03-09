<script setup lang="ts">
const props = defineProps<{
  headers: { title: string; key: string; sortable?: boolean }[]
  items: any[]
  loading: boolean
  page: number
  limit: number
  totalItems: number
  totalPaginas: number
  itemKey?: string  
}>()

const emit = defineEmits<{
  editar: [item: any]
  eliminar: [item: any]
  'update:page': [page: number]
}>()

const getItemId = (item: any): number => {
  return item[props.itemKey ?? 'id']
}
</script>

<template>
  <v-card class="table-card" theme="light">

    <div class="table-scroll">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        hide-default-footer
        :items-per-page="-1"
      >
        <template #no-data>
          <div class="no-data">
            <v-icon size="48" color="grey-lighten-1">mdi-database-off-outline</v-icon>
            <p>No hay registros disponibles</p>
          </div>
        </template>

        <template #item.acciones="{ item }">
          <div class="actions-cell">
            <v-btn icon variant="text" size="small" @click="emit('editar', item)">
              <v-icon size="18">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon variant="text" size="small" @click="emit('eliminar', item)">
              <v-icon size="18">mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="table-footer">
      <span class="results-info">
        Mostrando {{ (page - 1) * limit + 1 }} a
        {{ Math.min(page * limit, totalItems) }} de
        {{ totalItems.toLocaleString() }} resultados
      </span>
      <v-pagination
        :model-value="page"
        :length="totalPaginas"
        :total-visible="5"
        density="compact"
        @update:model-value="emit('update:page', $event)"
      />
    </div>

  </v-card>
</template>

<style scoped>
.table-scroll {
  max-height: 500px;
  overflow-y: auto;
}

.table-scroll :deep(thead) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px;
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>