<script setup lang="ts">
defineProps<{
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

</script>

<template>
  <v-card class="table-card">
    <div class="table-scroll">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        hide-default-footer
        :items-per-page="-1"
      >
        <template v-for="(_, name) in $slots" :key="String(name)" #[name]="slotData">
          <slot :name="name" v-bind="slotData ?? {}" />
        </template>

        <template #no-data>
          <div class="no-data">
            <v-icon size="48" color="on-surface">mdi-database-off-outline</v-icon>
            <p>No hay registros disponibles</p>
          </div>
        </template>

        <template #item.acciones="{ item }">
          <div class="actions-cell">
            <template v-if="$slots['acciones']">
              <slot name="acciones" :item="item" />
            </template>
            <template v-else>
              <v-btn icon variant="text" size="small" @click="emit('editar', item)">
                <v-icon size="18">mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn icon variant="text" size="small" @click="emit('eliminar', item)">
                <v-icon size="18">mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
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
  background: rgb(var(--v-theme-surface));
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}
</style>
